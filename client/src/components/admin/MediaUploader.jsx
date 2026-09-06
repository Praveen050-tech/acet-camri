import React, { useState, useRef } from 'react';
import { uploadAPI } from '../../api/client';
import { UploadCloud, X, Film, Box, Image as ImageIcon, Loader2 } from 'lucide-react';

export const MediaUploader = ({ mediaUrls, setMediaUrls }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const newUrls = [...(mediaUrls || [])];

    for (let file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadAPI.uploadCadFile(formData); // Using same upload logic
        if (res.data.success && res.data.fileUrl) {
          newUrls.push(res.data.fileUrl);
        }
      } catch (err) {
        console.error('Failed to upload file:', file.name, err);
        alert(`Failed to upload ${file.name}`);
      }
    }

    setMediaUrls(newUrls);
    setUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (index) => {
    const newUrls = [...(mediaUrls || [])];
    newUrls.splice(index, 1);
    setMediaUrls(newUrls);
  };

  const getMediaIcon = (url) => {
    if (!url || typeof url !== 'string') return <ImageIcon size={24} className="text-gray-400" />;
    const ext = url.split('?')[0].split('.').pop().toLowerCase();
    if (['mp4', 'webm', 'mov'].includes(ext)) return <Film size={24} className="text-blue-500" />;
    if (['glb', 'gltf'].includes(ext)) return <Box size={24} className="text-purple-500" />;
    return <ImageIcon size={24} className="text-green-500" />;
  };

  const isImage = (url) => {
    if (!url || typeof url !== 'string') return false;
    const ext = url.split('?')[0].split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
  };

  return (
    <div className="space-y-4">
      <label className="font-bold text-gray-700 block mb-1">Product Media (Images, Videos, 3D Models)</label>
      
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-gray-50 border-gray-300 hover:border-[#00714C] hover:bg-green-50/30'}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#00714C] animate-spin" />
            <p className="text-sm font-medium text-gray-600">Uploading media...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Click to upload files</p>
              <p className="text-xs text-gray-500 mt-1">Images (JPG, PNG), Videos (MP4), 3D Models (GLB)</p>
            </div>
          </div>
        )}
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
          accept="image/*,video/mp4,video/webm,.glb,.gltf"
          disabled={uploading}
        />
      </div>

      {/* Media Preview Grid */}
      {(mediaUrls || []).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {(mediaUrls || []).map((url, idx) => (
            <div key={idx} className="relative group rounded-xl border border-gray-200 bg-white overflow-hidden aspect-square flex items-center justify-center">
              {isImage(url) ? (
                <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  {getMediaIcon(url)}
                  <p className="text-xs text-gray-500 font-medium mt-2 break-all line-clamp-2">
                    {typeof url === 'string' ? url.split('/').pop().split('?')[0] : 'Unknown File'}
                  </p>
                </div>
              )}
              
              <button 
                type="button"
                onClick={() => removeMedia(idx)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
              >
                <X size={16} />
              </button>
              
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                {idx === 0 ? 'Primary Thumbnail' : `Media ${idx + 1}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
