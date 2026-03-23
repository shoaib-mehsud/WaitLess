const YOUR_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzc0MjUwODc1LCJleHAiOjE3NzQzMzcyNzV9.HcJfS9F6wjS9wEkrGWR3casZXR10PPPScVtTGren9a0"; // <-- Put your real token here
const QUEUE_ID = 2; // <-- Use the queue ID you are testing

async function fireRequests() {
    console.log("Firing 10 concurrent requests to the WaitLess server...");
    
    const requests = [];
    
    // Create 10 requests to fire at the exact same time
    for (let i = 0; i < 10; i++) {
        const req = fetch(`http://localhost:3000/api/v1/token/join/${QUEUE_ID}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${YOUR_JWT}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        
        requests.push(req);
    }

    // Promise.all fires them simultaneously
    const results = await Promise.all(requests);
    
    // Print the ticket numbers we got back
    console.log("\n--- TEST RESULTS ---");
    results.forEach((res, index) => {
        if (res.success) {
            console.log(`Request ${index + 1}: Assigned Ticket #${res.data.ticketCode}`);
        } else {
            console.log(`Request ${index + 1}: FAILED - ${res.message}`);
        }
    });
}

fireRequests();