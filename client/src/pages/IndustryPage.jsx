import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, ImageIcon, FileText } from 'lucide-react';
import { pageContentAPI } from '../api/client';

export const IndustryPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await pageContentAPI.getByPage('industry');
        if (res.data.success) setBlocks(res.data.data);
      } catch (err) {
        console.error('Failed to load page content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="font-['Cinzel'] text-4xl md:text-5xl font-bold text-[#00714C] mb-6">Industry Collaboration</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {blocks.length > 0
              ? 'Explore our capabilities, resources, and institutional offerings below.'
              : 'This section is currently being updated by the CAMRI administration. Please check back soon for detailed information about our institutional capabilities and offerings.'
            }
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#00714C] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block, idx) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:border-[#00714C]/30 transition-all group"
              >
                {block.imageUrl ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={block.imageUrl}
                      alt={block.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#eef9f3] to-[#d4f0e4] flex items-center justify-center">
                    <FileText size={40} className="text-[#00714C]/40" />
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <h3 className="font-['Readex_Pro'] text-lg font-bold text-gray-900">{block.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{block.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center py-20">
            <Box size={48} className="text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Content in Development</h2>
            <p className="text-gray-500 max-w-md">
              We are preparing comprehensive documentation regarding CAMRI's Industry Collaboration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
