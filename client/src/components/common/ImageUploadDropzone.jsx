import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  Link2,
  FolderOpen
} from 'lucide-react';
import { uploadEventPoster } from '../../services/storageService';

export function ImageUploadDropzone({
  currentUrl = '',
  onImageSelected = () => {},
  presets = []
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'presets' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(null); // { url, provider, fileName }
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      await processFileUpload(files[0]);
    }
  };

  const handleFileInputChange = async (e) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      await processFileUpload(files[0]);
    }
  };

  const processFileUpload = async (file) => {
    setUploadError('');
    setUploadSuccess(null);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const result = await uploadEventPoster(file, (percent) => {
        setUploadProgress(percent);
      });

      setUploadSuccess(result);
      onImageSelected(result.url);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelectedImage = () => {
    setUploadSuccess(null);
    setUploadProgress(0);
    setUploadError('');
    onImageSelected('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl w-fit border border-slate-200/60">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'upload'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Image / Poster</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'presets'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Preset Themes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'url'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Direct Web URL</span>
        </button>
      </div>

      {/* Tab 1: Upload from Computer (Firebase Cloud Storage) */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
          />

          {/* Dropzone container */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                {isUploading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  {isUploading
                    ? 'Uploading to Cloud Storage...'
                    : 'Drop your event banner here, or click to browse'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supports PNG, JPG, WebP, GIF up to 8MB
                </p>
              </div>

              {/* Live Upload Progress Indicator */}
              {isUploading && (
                <div className="w-full max-w-xs space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Success / Provider Badge */}
          {uploadSuccess && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>{uploadSuccess.fileName}</strong> uploaded successfully!
                </span>
                <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {uploadSuccess.provider === 'firebase-storage' ? '☁️ Firebase Cloud Storage' : '💾 Media Store'}
                </span>
              </div>
              <button
                type="button"
                onClick={clearSelectedImage}
                className="text-emerald-700 hover:text-rose-600 p-1"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Alert */}
          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Curated Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {presets.map((b, idx) => {
            const isSelected = currentUrl === b.url;
            return (
              <button
                type="button"
                key={idx}
                onClick={() => onImageSelected(b.url)}
                className={`p-2 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <img
                  src={b.url}
                  alt=""
                  className="w-12 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    {b.label}
                  </span>
                  <span className="text-[10px] text-slate-400">Preset Theme</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 3: Direct Web URL */}
      {activeTab === 'url' && (
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Image Direct Web URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => onImageSelected(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>
      )}

      {/* Active Banner Preview Card */}
      {currentUrl && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
          <img
            src={currentUrl}
            alt="Event banner preview"
            className="w-full h-44 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-4">
            <span className="text-xs font-semibold text-white drop-shadow-sm flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Current Banner Selected</span>
            </span>
            <button
              type="button"
              onClick={clearSelectedImage}
              className="px-2.5 py-1 bg-white/90 hover:bg-rose-600 hover:text-white text-slate-800 rounded-lg text-[11px] font-bold backdrop-blur-sm transition flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
