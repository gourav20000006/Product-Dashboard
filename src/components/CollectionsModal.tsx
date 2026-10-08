import React, { useState } from 'react';
import {
  X,
  FolderHeart,
  Plus,
  Trash2,
  ExternalLink,
  Play,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { VideoCollection, VideoItem } from '../types.ts';

interface CollectionsModalProps {
  collections: VideoCollection[];
  allVideos: VideoItem[];
  onClose: () => void;
  onCreateCollection: (name: string, description: string) => void;
  onDeleteCollection: (id: string) => void;
  onRemoveVideo: (collectionId: string, videoId: string) => void;
  onOpenVideo: (video: VideoItem) => void;
}

export const CollectionsModal: React.FC<CollectionsModalProps> = ({
  collections,
  allVideos,
  onClose,
  onCreateCollection,
  onDeleteCollection,
  onRemoveVideo,
  onOpenVideo,
}) => {
  const [selectedColId, setSelectedColId] = useState<string>(
    collections[0]?.id || ''
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const activeCollection = collections.find((c) => c.id === selectedColId);

  // Match videos in active collection
  const videoMap = new Map(allVideos.map((v) => [v.id, v]));
  const collectionVideos = (activeCollection?.videoIds || [])
    .map((id) => videoMap.get(id))
    .filter(Boolean) as VideoItem[];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    onCreateCollection(newColName.trim(), newColDesc.trim());
    setNewColName('');
    setNewColDesc('');
    setShowCreateForm(false);
  };

  const handleExportCollectionCSV = () => {
    if (!activeCollection || collectionVideos.length === 0) return;
    const headers = ['ID', 'Platform', 'Match Score', 'Title', 'Handle', 'Views', 'Source URL'];
    const rows = collectionVideos.map((v) => [
      `"${v.id}"`,
      `"${v.platform}"`,
      v.matchScore,
      `"${v.title.replace(/"/g, '""')}"`,
      `"${v.author.handle}"`,
      v.metrics.views,
      `"${v.sourceUrl}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `collection_${activeCollection.name.replace(/[^a-z0-9]/gi, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-[#f8f6f2] w-full max-w-4xl rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f5f3ff] flex items-center justify-center text-[#7c3aed]">
              <FolderHeart className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <div>
              <span className="mono text-[#7c3aed] font-bold">Project Collections</span>
              <h2 className="font-newsreader text-2xl font-bold text-[#1a1a1a]">
                Creative Moodboards & Shortlist Folders
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#888] hover:text-[#1a1a1a] cursor-pointer rounded-full hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Layout: Left Sidebar of Collections, Right Video Grid */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Collections list */}
          <div className="w-full md:w-64 bg-white border-r border-[rgba(26,26,26,0.08)] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="label-mono">Your Boards</span>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="p-1 rounded text-xs font-mono flex items-center gap-1 hover:bg-[#faf9f5] cursor-pointer text-[#1a1a1a]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>

              {/* Create new collection inline */}
              {showCreateForm && (
                <form
                  onSubmit={handleCreate}
                  className="p-3 bg-[#faf9f5] border border-[rgba(26,26,26,0.1)] rounded mb-3 space-y-2 text-xs font-mono"
                >
                  <input
                    type="text"
                    required
                    placeholder="Board name..."
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    className="w-full p-1.5 bg-white border border-[rgba(26,26,26,0.15)] rounded outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newColDesc}
                    onChange={(e) => setNewColDesc(e.target.value)}
                    className="w-full p-1.5 bg-white border border-[rgba(26,26,26,0.15)] rounded outline-none"
                  />
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-2 py-1 text-[rgba(26,26,26,0.6)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-[#1a1a1a] text-white rounded cursor-pointer"
                    >
                      Create
                    </button>
                  </div>
                </form>
              )}

              {/* Collection buttons */}
              <div className="space-y-1.5">
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedColId(col.id)}
                    className={`w-full text-left p-2.5 rounded font-mono text-xs flex items-center justify-between transition cursor-pointer ${
                      col.id === selectedColId
                        ? 'bg-[#1a1a1a] text-white shadow-xs font-semibold'
                        : 'text-[rgba(26,26,26,0.8)] hover:bg-[#faf9f5]'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate text-[0.75rem]">{col.name}</div>
                      <div
                        className={`text-[0.6rem] truncate ${
                          col.id === selectedColId
                            ? 'text-white/60'
                            : 'text-[rgba(26,26,26,0.4)]'
                        }`}
                      >
                        {col.description || 'Custom board'}
                      </div>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[0.6rem] shrink-0 ${
                        col.id === selectedColId
                          ? 'bg-white/20 text-white'
                          : 'bg-[#f4f2eb] text-[#1a1a1a]'
                      }`}
                    >
                      {col.videoIds.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {activeCollection && (
              <div className="pt-4 border-t border-[rgba(26,26,26,0.08)] mt-4">
                <button
                  type="button"
                  onClick={() => onDeleteCollection(activeCollection.id)}
                  className="w-full py-1.5 text-rose-700 hover:bg-rose-50 rounded text-xs font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Board</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Videos inside collection */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#faf9f5]">
            {activeCollection && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[rgba(26,26,26,0.08)]">
                <div>
                  <h3 className="font-serif-cormorant text-2xl font-bold text-[#1a1a1a]">
                    {activeCollection.name}
                  </h3>
                  <p className="text-xs font-mono text-[rgba(26,26,26,0.5)]">
                    {activeCollection.description || 'Organized video references'} •{' '}
                    {collectionVideos.length} Saved Creatives
                  </p>
                </div>

                {collectionVideos.length > 0 && (
                  <button
                    onClick={handleExportCollectionCSV}
                    className="px-3 py-1.5 rounded border border-[rgba(26,26,26,0.15)] bg-white hover:bg-[#f4f2eb] text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Export Board CSV</span>
                  </button>
                )}
              </div>
            )}

            {collectionVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {collectionVideos.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white border border-[rgba(26,26,26,0.1)] rounded overflow-hidden flex flex-col justify-between group shadow-2xs hover:shadow-md transition"
                  >
                    <div className="relative aspect-9/16 bg-black/10 overflow-hidden">
                      <img
                        src={v.thumbnailUrl}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/75 text-white rounded text-[0.6rem] font-mono">
                        {v.matchScore}% Match
                      </div>

                      <button
                        onClick={() => onOpenVideo(v)}
                        className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </button>
                    </div>

                    <div className="p-3 font-mono text-xs">
                      <div className="text-[0.65rem] text-[rgba(26,26,26,0.5)] truncate">
                        @{v.author.handle} • {v.platform.toUpperCase()}
                      </div>
                      <div className="font-semibold text-[#1a1a1a] truncate mb-2">
                        {v.title}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[rgba(26,26,26,0.06)]">
                        <span className="text-[0.65rem] text-[rgba(26,26,26,0.5)]">
                          {v.metrics.views.toLocaleString()} views
                        </span>
                        <button
                          onClick={() => onRemoveVideo(selectedColId, v.id)}
                          className="text-rose-600 hover:text-rose-800 text-[0.65rem] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[rgba(26,26,26,0.08)] p-12 text-center rounded">
                <Layers className="w-8 h-8 text-[rgba(26,26,26,0.2)] mx-auto mb-2" />
                <p className="font-serif-cormorant text-xl text-[rgba(26,26,26,0.7)] mb-1">
                  This board is empty
                </p>
                <p className="text-xs font-mono text-[rgba(26,26,26,0.4)]">
                  Browse discovered videos and click "Add to Board" to curate your campaign inspirations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
