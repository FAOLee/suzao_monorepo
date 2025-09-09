/**
 * Cryptography utilities (requires SparkMD5 library)
 */

/**
 * Calculate MD5 hash of a file
 * @param file - File to hash
 * @returns Promise with MD5 hash and file
 */
export function calculateFileMD5(file: File): Promise<{ fileMd5: string; rcFile: File }> {
  return new Promise((resolve, reject) => {
    // Check if SparkMD5 is available
    if (typeof window === 'undefined' || !('SparkMD5' in window)) {
      reject(new Error('SparkMD5 library is not available'))
      return
    }

    const SparkMD5 = (window as any).SparkMD5
    const fileReader = new FileReader()
    const blobSlice = File.prototype.slice || (File.prototype as any).mozSlice || (File.prototype as any).webkitSlice
    const chunkSize = 2097152 // 2MB chunks
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5()

    fileReader.onload = function (e) {
      if (e.target?.result) {
        spark.appendBinary(e.target.result as string)
        currentChunk++
        
        if (currentChunk < chunks) {
          loadNext()
        } else {
          const md = spark.end()
          resolve({ fileMd5: md, rcFile: file })
        }
      }
    }

    fileReader.onerror = function () {
      reject(new Error('Error reading file'))
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsBinaryString(blobSlice.call(file, start, end))
    }

    loadNext()
  })
}