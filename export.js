const { execSync } = require('child_process');

const mongoURI = 'mongodb://localhost:27017/fras'; // Update with your MongoDB URI
const collections = ['attendances', 'users'];
const outputFiles = collections.map(
  (collection) => `exported-data-${collection}.json`,
);

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function exportData() {
  for (let i = 0; i < collections.length; i++) {
    const collectionName = collections[i];
    const outputFile = outputFiles[i];

    // Construct the mongoexport command
    const mongoExportCommand = `mongoexport --uri=${mongoURI} --collection=${collectionName} --out=${outputFile} --jsonArray`;

    try {
      // Execute the export command using the locally installed MongoDB tools
      execSync(mongoExportCommand, {
        stdio: 'inherit',
        timeout: 50000,
      });

      console.log(
        `Data from ${collectionName} exported successfully to ${outputFile}`,
      );
    } catch (error) {
      console.error('Error exporting data:', error.message);
    }
  }
}

exportData();
