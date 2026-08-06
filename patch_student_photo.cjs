const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/components/StudentProfileModal.tsx', 'utf8');

if (!code.includes('import { getStorage')) {
  code = `import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';\n${code}`;
}

const photoUploadRegex = /const handlePhotoUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\n\s*\};/;
const photoUploadReplacement = `const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStaff) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Maximum size is 2MB.");
      return;
    }
    setIsUploadingPhoto(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, \`profile_photos/\${student.id}_\${Date.now()}\`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({ ...formData, photoUrl: url });
    } catch(err) {
      alert("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };`;

code = code.replace(photoUploadRegex, photoUploadReplacement);

fs.writeFileSync('src/pages/Staff/components/StudentProfileModal.tsx', code);
