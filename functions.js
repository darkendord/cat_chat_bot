const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

async function createAssistant(client) {
  const assistantFilePath = path.join(__dirname, 'assistant.json');

  try {
    // Check if assistant.json exists
    if (await fsp.access(assistantFilePath).then(() => true).catch(() => false)) {
      const fileContent = await fsp.readFile(assistantFilePath, 'utf8');
      if (fileContent) {
        try {
          const assistantData = JSON.parse(fileContent);
          if (assistantData.vector_store_id) {
            console.log("Loaded existing vector store ID.");
            return { vectorStoreId: assistantData.vector_store_id };
          }
        } catch (e) {
          console.warn("assistant.json is invalid. Creating a new vector store...");
        }
      } else {
        console.warn("assistant.json is empty. Creating a new vector store...");
      }
    }

    // 1. Upload the file to OpenAI
    const fileUpload = await client.files.create({
      file: fs.createReadStream(path.join(__dirname, 'banking_sok.docx')),
      purpose: 'assistants',
    });

    // 2. Create a vector store with the file_id
    const vectorStore = await client.vectorStores.create({
      file_ids: [fileUpload.id],
    });

    // Save the vector store ID for later use
    await fsp.writeFile(
      assistantFilePath,
      JSON.stringify({ vector_store_id: vectorStore.id })
    );
    console.log("Created a new vector store and saved the ID.");

    return { vectorStoreId: vectorStore.id };
  } catch (error) {
    console.error("Error in createAssistant:", error);
    throw error;
  }
}

module.exports = { createAssistant };