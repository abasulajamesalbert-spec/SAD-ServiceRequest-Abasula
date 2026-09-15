let currentUser = null;
let userRole = "Requester"; // Default role

document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkAuth();
  if (session) {
    currentUser = session.user;
    
    // Fetch profile role from Supabase
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();
      
    if (profile) userRole = profile.role;

    enforceRoleUI(userRole);
    loadRequests();
  }
});

async function loadRequests() {
  let { data: requests, error } = await supabaseClient
    .from("service_requests")
    .select("*")
    .order("id", { ascending: false });

  if (error) return console.error(error);

  updateDashboard(requests);

  const searchVal = document.getElementById("search").value.toLowerCase();
  const statusVal = document.getElementById("filter-status").value;
  const priorityVal = document.getElementById("filter-priority").value;

  const filtered = requests.filter(r => {
    const matchesSearch = 
      (r.requester_name && r.requester_name.toLowerCase().includes(searchVal)) ||
      (r.description && r.description.toLowerCase().includes(searchVal)) ||
      (r.category && r.category.toLowerCase().includes(searchVal)) ||
      (r.department && r.department.toLowerCase().includes(searchVal));

    const matchesStatus = statusVal === "All" || r.status === statusVal;
    const matchesPriority = priorityVal === "All" || r.priority === priorityVal;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const tbody = document.getElementById("requests-table");
  tbody.innerHTML = "";
  filtered.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.requester_name}</td>
        <td>${r.department}</td>
        <td>${r.category}</td>
        <td>${r.priority}</td>
        <td><strong>${r.status}</strong></td>
        <td>
          <button class="action-btn" onclick="editRequest(${r.id}, '${r.requester_name}', '${r.department}', '${r.category}', '${r.priority}', '${r.status}', '${r.description.replace(/'/g, "\\'")}')">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteRequest(${r.id})">Delete</button>
        </td>
      </tr>`;
  });

  enforceRoleUI(userRole);
}

function updateDashboard(data) {
  document.getElementById("cnt-total").innerText = data.length;
  document.getElementById("cnt-pending").innerText = data.filter(r => r.status === "Pending").length;
  document.getElementById("cnt-approved").innerText = data.filter(r => r.status === "Approved").length;
  document.getElementById("cnt-released").innerText = data.filter(r => r.status === "Released").length;
}

async function saveRequest(e) {
  e.preventDefault();
  const id = document.getElementById("req-id").value;
  const newStatus = document.getElementById("status").value || "Pending";

  // BR-A4-03: Rule Enforcement
  if ((newStatus === "Approved" || newStatus === "Rejected") && userRole !== "Administrator") {
    alert("BR-A4-03 Violation: Only Administrators can Approve or Reject requests.");
    return;
  }

  const payload = {
    requester_name: document.getElementById("requester_name").value,
    department: document.getElementById("department").value,
    category: document.getElementById("category").value,
    priority: document.getElementById("priority").value,
    status: newStatus,
    description: document.getElementById("description").value,
    user_id: currentUser.id
  };

  if (id) {
    await supabaseClient.from("service_requests").update(payload).eq("id", id);
    await logAudit(currentUser.id, "UPDATE", "Borrowing", id, `Updated transaction status to ${newStatus}`);
  } else {
    const { data } = await supabaseClient.from("service_requests").insert([payload]).select();
    if (data && data[0]) {
      await logAudit(currentUser.id, "CREATE", "Borrowing", data[0].id, "Created borrowing request");
    }
  }

  document.getElementById("requestForm").reset();
  document.getElementById("req-id").value = "";
  document.getElementById("btn-save").innerText = "Submit Request";
  loadRequests();
}

function editRequest(id, requester, dept, category, priority, status, desc) {
  document.getElementById("req-id").value = id;
  document.getElementById("requester_name").value = requester;
  document.getElementById("department").value = dept;
  document.getElementById("category").value = category;
  document.getElementById("priority").value = priority;
  document.getElementById("status").value = status;
  document.getElementById("description").value = desc;
  document.getElementById("btn-save").innerText = "Update Request";
}

async function deleteRequest(id) {
  if (userRole !== "Administrator") {
    alert("Access Denied: Only Administrators can delete records.");
    return;
  }

  if (confirm("Are you sure you want to delete this request?")) {
    await supabaseClient.from("service_requests").delete().eq("id", id);
    await logAudit(currentUser.id, "DELETE", "Borrowing", id, "Deleted transaction record");
    loadRequests();
  }
}

function enforceRoleUI(role) {
  const actionButtons = document.querySelectorAll('.action-btn'); 
  const adminElements = document.querySelectorAll('.admin-only');

  if (role === 'Requester' || role === 'Requester/Viewer') {
    actionButtons.forEach(btn => btn.style.display = 'none');
  }
  
  if (role !== 'Administrator') {
    adminElements.forEach(el => el.style.display = 'none');
  }
}

async function logAudit(userId, action, moduleName, recordId, description) {
  const { error } = await supabaseClient
    .from('audit_logs')
    .insert([
      { 
        user_id: userId, 
        action: action, 
        module: moduleName, 
        record_id: recordId, 
        description: description 
      }
    ]);
  
  if (error) {
    console.error("Audit Log Error:", error.message);
  }
}