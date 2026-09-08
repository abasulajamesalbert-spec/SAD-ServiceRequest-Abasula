let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkAuth();
  if (session) {
    currentUser = session.user;
    loadRequests();
  }
});

async function loadRequests() {
  let { data: requests, error } = await supabaseClient.from("service_requests").select("*").order("id", { ascending: false });
  if (error) return console.error(error);

  updateDashboard(requests);

  const searchVal = document.getElementById("search").value.toLowerCase();
  const statusVal = document.getElementById("filter-status").value;
  const priorityVal = document.getElementById("filter-priority").value;

  const filtered = requests.filter(r => {
    const matchesSearch = 
      r.requester_name.toLowerCase().includes(searchVal) ||
      r.description.toLowerCase().includes(searchVal) ||
      r.category.toLowerCase().includes(searchVal) ||
      r.department.toLowerCase().includes(searchVal);

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
        <td>${r.status}</td>
        <td>
          <button onclick="editRequest(${r.id}, '${r.requester_name}', '${r.department}', '${r.category}', '${r.priority}', '${r.status}', '${r.description.replace(/'/g, "\\'")}')">Edit</button>
          <button class="delete-btn" onclick="deleteRequest(${r.id})">Delete</button>
        </td>
      </tr>`;
  });
}

function updateDashboard(data) {
  document.getElementById("cnt-total").innerText = data.length;
  document.getElementById("cnt-pending").innerText = data.filter(r => r.status === "Pending").length;
  document.getElementById("cnt-progress").innerText = data.filter(r => r.status === "In Progress").length;
  document.getElementById("cnt-completed").innerText = data.filter(r => r.status === "Completed").length;
}

async function saveRequest(e) {
  e.preventDefault();
  const id = document.getElementById("req-id").value;
  const payload = {
    requester_name: document.getElementById("requester_name").value,
    department: document.getElementById("department").value,
    category: document.getElementById("category").value,
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value || "Pending",
    description: document.getElementById("description").value,
    user_id: currentUser.id
  };

  if (id) {
    await supabaseClient.from("service_requests").update(payload).eq("id", id);
  } else {
    await supabaseClient.from("service_requests").insert([payload]);
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
  if (confirm("Are you sure you want to delete this request?")) {
    await supabaseClient.from("service_requests").delete().eq("id", id);
    loadRequests();
  }
}