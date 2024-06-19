async function uploadImage() {
  const fileInput = document.getElementById('imageInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select an image file.');
    return;
  }

  const formData = new FormData();
  formData.append('image', file, file.name);

  try {
    const response = await fetch('/api/ocr', { // This URL should match your backend route
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Log OCR Response received from the server
    console.log('OCR Response:', data);

    // Display the extracted text on the webpage
    const extractedText = Array.isArray(data.ParsedResults) && data.ParsedResults.length > 0
      ? data.ParsedResults[0].ParsedText || 'No text extracted'
      : 'No text extracted';
    document.getElementById('extractedText').textContent = extractedText;
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('extractedText').textContent = 'Error processing image. Please try again.';
  }
}
