export const fetchStatus = async () => {
  const response = await fetch('http://localhost:5001/ping', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}