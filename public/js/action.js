

// function approve(id) {
//     alert(id);
// }

// function reject(id) {
//     alert(id);
// }

async function approve(id) {
    console.log(id);
    try {
        const response = await axios.post(`http://localhost:4000/assingment/${id}/accept`, {
            data: id
        });
        console.log(response, "AP");
        alert(`Approved: ${response.data.message}`);
        window.location.reload();
        // Optionally refresh or update the UI here
    } catch (error) {
        console.error('Error:', error);
        alert(`Error approving: ${error.response?.data?.message || error.message}`);
    }
}

async function reject(id) {
    try {
        const response = await axios.post(`http://localhost:4000/assingment/${id}/reject`, {
            data: id
        });

        alert(`Rejected: ${response.data.message}`);
        window.location.reload();
        // Optionally refresh or update the UI here
    } catch (error) {
        console.error('Error:', error);
        alert(`Error rejecting: ${error.response?.data?.message || error.message}`);
    }
}
