// Helper functions for file operations

/**
 * Read file as Base64 string
 * @param {File} file - File object from input
 * @returns {Promise<string>} Base64 encoded string
 */
export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Read file as text
 * @param {File} file - File object from input
 * @returns {Promise<string>} File content as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

/**
 * Get file extension
 * @param {File} file - File object
 * @returns {string} File extension
 */
export const getFileExtension = (file) => {
  return file.name.split(".").pop().toLowerCase()
}

/**
 * Validate image file
 * @param {File} file - File object
 * @returns {boolean} True if valid image
 */
export const isValidImageFile = (file) => {
  const validTypes = ["image/png", "image/jpeg", "image/jpg"]
  return validTypes.includes(file.type)
}
