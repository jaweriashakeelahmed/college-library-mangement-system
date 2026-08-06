const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/components/BookFormModal.tsx', 'utf8');

if (!code.includes('import { getStorage')) {
  code = `import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';\n${code}`;
}

const fileUploadRegex = /const handleFileUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\n\s*\}\n\s*\};/;
const fileUploadReplacement = `const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      try {
        const storage = getStorage();
        const storageRef = ref(storage, \`book_covers/\${Date.now()}_\${file.name}\`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setFormData(prev => ({ ...prev, imageUrl: url }));
      } catch(err) {
        alert("Failed to upload book cover");
      }
    }
  };`;

code = code.replace(fileUploadRegex, fileUploadReplacement);
fs.writeFileSync('src/pages/Staff/components/BookFormModal.tsx', code);
