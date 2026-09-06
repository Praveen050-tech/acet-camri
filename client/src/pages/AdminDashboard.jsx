import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, orderAPI, customRequestAPI, productAPI, settingsAPI, uploadAPI, pageContentAPI } from '../api/client';
// Media icons handled via existing Box import
import axios from 'axios';
import { MediaUploader } from '../components/admin/MediaUploader';
import { 
  ShieldCheck, Box, RefreshCw, CheckCircle2, Clock, Layers, 
  AlertCircle, LogOut, Plus, Trash2, Edit3, MessageSquare, ExternalLink, X, Settings, FileText 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cadRequests, setCadRequests] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'cad' | 'inquiries' | 'beds' | 'settings'
  const [settings, setSettings] = useState({ studentDiscountPercent: 40, facultyDiscountPercent: 20 });
  const [savingSettings, setSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'college-merch',
    categoryLabel: 'College Merch',
    salePrice: 999,
    regularPrice: 1499,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    description: '',
    stock: 50,
    badge: 'NEW DROP'
  });
  const [addingProduct, setAddingProduct] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedModel3d, setUploadedModel3d] = useState('');
  const [editUploadedImages, setEditUploadedImages] = useState([]);
  const [editUploadedVideos, setEditUploadedVideos] = useState([]);
  const [editUploadedModel3d, setEditUploadedModel3d] = useState('');
  const [mediaUploading, setMediaUploading] = useState(false);

  // Edit Website Pages State
  const [pageContentBlocks, setPageContentBlocks] = useState([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState('facilities');
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false);
  const [editContentId, setEditContentId] = useState(null);
  const [contentFormData, setContentFormData] = useState({ title: '', description: '', imageUrl: '', position: 0 });
  const [savingContent, setSavingContent] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  const PAGE_OPTIONS = [
    { slug: 'facilities', label: 'Facilities & Technologies' },
    { slug: 'services', label: 'Services' },
    { slug: 'research', label: 'Research & Innovation' },
    { slug: 'training', label: 'Training & Workshops' },
    { slug: 'projects', label: 'Student & Faculty Projects' },
    { slug: 'industry', label: 'Industry Collaboration' }
  ];

  const fetchPageContent = async (slug) => {
    setLoadingContent(true);
    try {
      const res = await pageContentAPI.getByPage(slug || selectedPageSlug);
      if (res.data.success) setPageContentBlocks(res.data.data);
    } catch (err) {
      console.error('Failed to load page content:', err);
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pages') fetchPageContent(selectedPageSlug);
  }, [activeTab, selectedPageSlug]);

  const handleCreateContent = async (e) => {
    e.preventDefault();
    if (!contentFormData.title) return;
    setSavingContent(true);
    try {
      const res = await pageContentAPI.create({ ...contentFormData, pageSlug: selectedPageSlug });
      if (res.data.success) {
        setPageContentBlocks([...pageContentBlocks, res.data.data]);
        setIsAddContentModalOpen(false);
        setContentFormData({ title: '', description: '', imageUrl: '', position: 0 });
      }
    } catch (err) {
      alert('Failed to create content block');
    } finally {
      setSavingContent(false);
    }
  };

  const handleEditContentClick = (block) => {
    setEditContentId(block.id);
    setContentFormData({ title: block.title, description: block.description, imageUrl: block.imageUrl || '', position: block.position || 0 });
    setIsEditContentModalOpen(true);
  };

  const handleUpdateContent = async (e) => {
    e.preventDefault();
    if (!contentFormData.title) return;
    setSavingContent(true);
    try {
      const res = await pageContentAPI.update(editContentId, contentFormData);
      if (res.data.success) {
        setPageContentBlocks(pageContentBlocks.map(b => b.id === editContentId ? res.data.data : b));
        setIsEditContentModalOpen(false);
        setContentFormData({ title: '', description: '', imageUrl: '', position: 0 });
      }
    } catch (err) {
      alert('Failed to update content block');
    } finally {
      setSavingContent(false);
    }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm('Delete this content block? This will remove it from the public page.')) return;
    try {
      await pageContentAPI.delete(id);
      setPageContentBlocks(pageContentBlocks.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to delete content block');
    }
  };

  const handleMediaUpload = async (file, type, isEdit = false) => {
    const formPayload = new FormData();
    formPayload.append('file', file);
    setMediaUploading(true);
    try {
      const res = await uploadAPI.uploadCadFile(formPayload);
      if (res.data.success) {
        const url = res.data.data?.url || res.data.fileUrl;
        if (type === 'image') {
          if (isEdit) setEditUploadedImages(prev => [...prev, url]);
          else setUploadedImages(prev => [...prev, url]);
        } else if (type === 'video') {
          if (isEdit) setEditUploadedVideos(prev => [...prev, url]);
          else setUploadedVideos(prev => [...prev, url]);
        } else if (type === 'model3d') {
          if (isEdit) setEditUploadedModel3d(url);
          else setUploadedModel3d(url);
        }
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setMediaUploading(false);
    }
  };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [editProductData, setEditProductData] = useState({});
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    fetchAdminData();
  }, [isAuthenticated, navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, cadRes, inqRes, settingsRes] = await Promise.all([
        adminAPI.getStats(),
        productAPI.getAll(),
        orderAPI.getAll(),
        customRequestAPI.getAll(),
        axios.get('/api/contact').catch(() => ({ data: { data: [] } })),
        settingsAPI.get().catch(() => ({ data: { data: {} } }))
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (productsRes.data.success) setProducts(productsRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (cadRes.data.success) setCadRequests(cadRes.data.data);
      if (inqRes.data.success) setInquiries(inqRes.data.data);
      if (settingsRes.data.success) setSettings(settingsRes.data.data);
    } catch (err) {
      console.error('Error fetching admin operations data:', err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await settingsAPI.update(settings);
      alert('Settings saved successfully!');
    } catch(err) {
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };
const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.salePrice) return;
    setAddingProduct(true);

    try {
            const res = await productAPI.create({
        ...newProduct,
        image: uploadedImages[0] || newProduct.image,
        images: uploadedImages.length > 0 ? uploadedImages : (newProduct.image ? [newProduct.image] : []),
        videos: uploadedVideos,
        model3d: uploadedModel3d || ''
      });
      if (res.data.success) {
        setProducts([res.data.data, ...products]);
        setIsAddModalOpen(false);
        setNewProduct({
          title: '',
          category: 'college-merch',
          categoryLabel: 'College Merch',
          salePrice: 999,
          regularPrice: 1499,
          image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
          description: '',
          stock: 50,
          badge: 'NEW DROP'
        });
      }
    } catch (err) {
      console.error('Failed to create product:', err);
    } finally {
      setAddingProduct(false);
    }
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditUploadedImages(product.images && product.images.length ? product.images.map(i => typeof i === 'string' ? i : i.url) : (product.image ? [product.image] : []));
    setEditProductData({
      title: product.title || '',
      category: product.category || 'college-merch',
      categoryLabel: product.categoryLabel || 'College Merch',
      salePrice: product.salePrice || 0,
      regularPrice: product.regularPrice || 0,
      image: product.image || '',
      description: product.description || '',
      stock: product.stock || 0,
      badge: product.badge || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProductData.title || !editProductData.salePrice) return;
    setUpdatingProduct(true);

    try {
            const res = await productAPI.update(editProductId, {
        ...editProductData,
        image: editUploadedImages[0] || editProductData.image,
        images: editUploadedImages.length > 0 ? editUploadedImages : (editProductData.image ? [editProductData.image] : []),
        videos: editUploadedVideos,
        model3d: editUploadedModel3d || ''
      });
      if (res.data.success) {
        setProducts(products.map(p => (p.id === editProductId ? res.data.data : p)));
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    } finally {
      setUpdatingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from the live store?')) return;
    try {
      await productAPI.delete(id);
      setProducts(products.filter(p => p.id !== id && p.slug !== id));
    } catch (err) {
      console.error('Delete product failed:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await orderAPI.updateStatus(orderId, { status: newStatus });
      if (res.data.success) {
        setOrders(orders.map(o => (o.orderId === orderId || o._id === orderId ? { ...o, status: newStatus } : o)));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleApproveCAD = async (requestId) => {
    try {
      const res = await customRequestAPI.approve(requestId, { assignedPrintBed: 'Bed 03 (Prusa MK4)' });
      if (res.data.success) {
        setCadRequests(cadRequests.map(r => (r.requestId === requestId ? { ...r, status: 'Approved & Slicing Bed Scheduled' } : r)));
      }
    } catch (err) {
      console.error('Error approving CAD model:', err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-white">
      
      {/* Top Header */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#00714C]/10 text-[#00714C] border border-[#00714C]/30 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              ACET CAMRI LAB CONTROL CENTER
            </span>
            <span className="text-[11px] text-[#00714C] font-bold">● 8 Machines Online</span>
          </div>
          <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            ACET CAMRI
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Logged in as: <strong className="text-gray-900">{user?.name || 'Club Lead'}</strong> ({user?.email}) • Kinathukadavu Main Lab
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#00714C] hover:bg-[#005a3c] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus size={14} />
            <span>Add New Product</span>
          </button>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="bg-gray-100 hover:bg-red-50 border border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-700 text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Store Catalog</span>
            <div className="font-['Outfit'] text-2xl font-black text-[#00714C] mt-1">
              {products.length} Products
            </div>
            <span className="text-[11px] text-gray-500">Active in database</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Total Orders</span>
            <div className="font-['Outfit'] text-2xl font-black text-gray-900 mt-1">
              {orders.length} Orders
            </div>
            <span className="text-[11px] text-[#00714C] font-medium">In print farm queue</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
            <span className="text-[10px] text-gray-500 uppercase font-bold">CAD Inquiries</span>
            <div className="font-['Outfit'] text-2xl font-black text-[#00714C] mt-1">
              {cadRequests.length} Pending
            </div>
            <span className="text-[11px] text-gray-500">Student prototypes</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
            <span className="text-[10px] text-gray-500 uppercase font-bold">General Inquiries</span>
            <div className="font-['Outfit'] text-2xl font-black text-gray-900 mt-1">
              {inquiries.length} Messages
            </div>
            <span className="text-[11px] text-gray-500">Student & event queries</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'products' ? 'bg-[#00714C] text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          ️ Products Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'orders' ? 'bg-[#00714C] text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
           Orders & Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('cad')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'cad' ? 'bg-[#00714C] text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
           Student CAD Requests ({cadRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'inquiries' ? 'bg-[#00714C] text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          ️ Contact Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'pages' ? 'bg-[#00714C] text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
           Edit Website Pages
        </button>
      </div>

      {/* Tab 1: Products Management (CRUD) */}
      {activeTab === 'products' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-sm text-gray-900">Manage 3D Store Catalog</h3>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#00714C] hover:bg-[#005a3c] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-800">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="p-3.5">Image</th>
                  <th className="p-3.5">Title & SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3.5">
                      <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-gray-100" />
                    </td>
                    <td className="p-3.5">
                      <strong className="text-gray-900 block font-semibold">{p.title}</strong>
                      <span className="font-mono text-[10px] text-gray-500">{p.sku || p.id}</span>
                    </td>
                    <td className="p-3.5 text-gray-600">{p.categoryLabel || p.category}</td>
                    <td className="p-3.5 font-bold text-[#00714C]">₹{p.salePrice}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-amber-600">{p.rating} ({p.reviewCount})</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button 
                        onClick={() => handleEditClick(p)}
                        className="text-gray-400 hover:text-[#00714C] p-1"
                        title="Edit Product"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-800">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Update Lifecycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-gray-50">
                    <td className="p-4 font-mono font-bold text-[#00714C]">{o.orderId}</td>
                    <td className="p-4 text-gray-900">
                      <strong>{o.customerName}</strong>
                      <span className="block text-[11px] text-gray-500">{o.contact}</span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {o.items?.map((it, idx) => (
                        <div key={idx} className="truncate max-w-xs">{it.title} ({it.quantity}x)</div>
                      ))}
                    </td>
                    <td className="p-4 font-bold text-gray-900">₹{o.total?.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className="bg-[#eef9f3] text-[#00714C] border border-[#aee6cb] px-3 py-1 rounded-full text-[10px] font-bold">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                        className="bg-white border border-gray-300 text-xs text-gray-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#00714C]"
                      >
                        <option value="Placed & Mesh Audit in Progress">1. Placed & Audit</option>
                        <option value="Confirmed & Slicing Complete">2. Confirmed</option>
                        <option value="Printing on Machine Bed">3. 3D Printing</option>
                        <option value="Ready for Campus Pickup">4. Ready for Pickup</option>
                        <option value="Dispatched via BlueDart Courier">5. Shipped</option>
                        <option value="Delivered & Collected">6. Delivered </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Student CAD Requests */}
      {activeTab === 'cad' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-800">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="p-4">Request ID</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">CAD File</th>
                  <th className="p-4">Material & Infill</th>
                  <th className="p-4">Quote</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cadRequests.map((r) => (
                  <tr key={r.requestId} className="hover:bg-gray-50">
                    <td className="p-4 font-mono font-bold text-[#00714C]">{r.requestId}</td>
                    <td className="p-4 text-gray-900">
                      <strong>{r.studentName}</strong> <br />
                      <span className="text-[10px] text-gray-500">{r.rollNo} • {r.contact}</span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-gray-600">
                       {r.fileName}
                    </td>
                    <td className="p-4 text-gray-600">
                      {r.material} ({r.infillDensity}% infill)
                    </td>
                    <td className="p-4 font-bold text-gray-900">₹{r.estimatedPrice}</td>
                    <td className="p-4">
                      <span className="bg-[#eef9f3] text-[#00714C] border border-[#aee6cb] px-3 py-1 rounded-full text-[10px] font-bold">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {r.status !== 'Approved & Slicing Bed Scheduled' ? (
                        <button 
                          onClick={() => handleApproveCAD(r.requestId)}
                          className="bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-[11px] px-3.5 py-1.5 rounded-xl shadow-xs"
                        >
                          Approve & Queue
                        </button>
                      ) : (
                        <span className="text-[#00714C] text-xs font-bold"> Scheduled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Contact Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-800">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inq, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-900">{inq.name}</td>
                    <td className="p-4 text-gray-600">
                      <div>{inq.email}</div>
                      <div className="text-[11px] text-gray-400">{inq.phone}</div>
                    </td>
                    <td className="p-4 font-semibold text-[#00714C]">{inq.subject}</td>
                    <td className="p-4 text-gray-700 max-w-sm">{inq.message}</td>
                    <td className="p-4 text-gray-400 text-[11px]">{new Date(inq.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Tab: Pending Payments */}
      {activeTab === 'payments' && (
        <div className="animate-fadeIn">
          <AdminPaymentsTab />
        </div>
      )}

      {/* Tab: Payment Settings */}
      {activeTab === 'payment-settings' && (
        <div className="animate-fadeIn">
          <AdminPaymentSettingsTab />
        </div>
      )}

      {/* Tab: Edit Website Pages */}
      {activeTab === 'pages' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-sm text-gray-900">Manage Page Content</h3>
              <select
                value={selectedPageSlug}
                onChange={(e) => setSelectedPageSlug(e.target.value)}
                className="bg-white border border-gray-300 text-xs text-gray-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#00714C]"
              >
                {PAGE_OPTIONS.map(p => (
                  <option key={p.slug} value={p.slug}>{p.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => { setContentFormData({ title: '', description: '', imageUrl: '', position: pageContentBlocks.length }); setIsAddContentModalOpen(true); }}
              className="bg-[#00714C] hover:bg-[#005a3c] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
            >
              <Plus size={14} /> Add Content Block
            </button>
          </div>

          {loadingContent ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-3 border-[#00714C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : pageContentBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText size={36} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No content blocks for this page yet.</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Content Block" to publish content to the <strong>{PAGE_OPTIONS.find(p => p.slug === selectedPageSlug)?.label}</strong> page.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-800">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                  <tr>
                    <th className="p-3.5">#</th>
                    <th className="p-3.5">Image</th>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageContentBlocks.map((block) => (
                    <tr key={block.id} className="hover:bg-gray-50">
                      <td className="p-3.5 text-gray-500 font-mono">{block.position}</td>
                      <td className="p-3.5">
                        {block.imageUrl ? (
                          <img src={block.imageUrl} alt={block.title} className="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-gray-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <FileText size={16} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <strong className="text-gray-900 block font-semibold">{block.title}</strong>
                      </td>
                      <td className="p-3.5 text-gray-600 max-w-xs truncate">{block.description}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button onClick={() => handleEditContentClick(block)} className="text-gray-400 hover:text-[#00714C] p-1" title="Edit"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteContent(block.id)} className="text-gray-400 hover:text-red-600 p-1" title="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Content Block Modal */}
      {isAddContentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAddContentModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={20} /></button>
            <h3 className="font-['Cinzel'] text-xl font-bold text-gray-900">Add Content Block</h3>
            <p className="text-xs text-gray-500">Publishing to: <strong className="text-[#00714C]">{PAGE_OPTIONS.find(p => p.slug === selectedPageSlug)?.label}</strong></p>
            <form onSubmit={handleCreateContent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Block Title *</label>
                <input type="text" required value={contentFormData.title} onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]" placeholder="e.g. SLA 3D Printing Lab" />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea rows={4} value={contentFormData.description} onChange={(e) => setContentFormData({ ...contentFormData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]" placeholder="Describe this section..." />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                <input type="url" value={contentFormData.imageUrl} onChange={(e) => setContentFormData({ ...contentFormData, imageUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]" placeholder="https://..." />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Position (order)</label>
                <input type="number" min="0" value={contentFormData.position} onChange={(e) => setContentFormData({ ...contentFormData, position: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]" />
              </div>
              <button type="submit" disabled={savingContent} className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-3.5 rounded-xl shadow transition-all text-xs flex items-center justify-center gap-1.5">
                <Plus size={14} />
                <span>{savingContent ? 'Publishing...' : 'Publish Content Block'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Content Block Modal */}
      {isEditContentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEditContentModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={20} /></button>
            <h3 className="font-['Cinzel'] text-xl font-bold text-gray-900">Edit Content Block</h3>
            <form onSubmit={handleUpdateContent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Block Title *</label>
                <input type="text" required value={contentFormData.title} onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]" />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea rows={4} value={contentFormData.description} onChange={(e) => setContentFormData({ ...contentFormData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]" />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                <input type="url" value={contentFormData.imageUrl} onChange={(e) => setContentFormData({ ...contentFormData, imageUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]" />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Position (order)</label>
                <input type="number" min="0" value={contentFormData.position} onChange={(e) => setContentFormData({ ...contentFormData, position: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]" />
              </div>
              <button type="submit" disabled={savingContent} className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-3.5 rounded-xl shadow transition-all text-xs flex items-center justify-center gap-1.5">
                <Edit3 size={14} />
                <span>{savingContent ? 'Updating...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h3 className="font-['Cinzel'] text-xl font-bold text-gray-900">Add New 3D Product to Store</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Binary ALU Logic Gate Model"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ 
                      ...newProduct, 
                      category: e.target.value,
                      categoryLabel: e.target.options[e.target.selectedIndex].text
                    })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                  >
                    <option value="college-merch">College Merch</option>
                    <option value="engineering-models">Engineering Models</option>
                    <option value="figurines">Figurines</option>
                    <option value="home-decor">Home & Décor</option>
                    <option value="event-merch">Fest Merch</option>
                    <option value="alumni-gifting">Alumni Gifting</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Badge Tag</label>
                  <input 
                    type="text"
                    placeholder="e.g. NEW DROP, WORKING KINEMATICS"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sale Price (₹) *</label>
                  <input 
                    type="number"
                    required
                    min="100"
                    value={newProduct.salePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, salePrice: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Regular MRP (₹)</label>
                  <input 
                    type="number"
                    min="100"
                    value={newProduct.regularPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, regularPrice: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>
              </div>

              <MediaUploader 
                mediaUrls={uploadedImages} 
                setMediaUrls={setUploadedImages} 
              />

              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Description</label>
                <textarea 
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="50-micron SLA micro-resolution print with smooth surface..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                />
              </div>

              <button 
                type="submit"
                disabled={addingProduct}
                className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-3.5 rounded-xl shadow transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>{addingProduct ? 'Adding Product...' : 'Publish Product to Live Store'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h3 className="font-['Cinzel'] text-xl font-bold text-gray-900">Edit 3D Product</h3>

            <form onSubmit={handleUpdateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title *</label>
                <input 
                  type="text"
                  required
                  value={editProductData.title}
                  onChange={(e) => setEditProductData({ ...editProductData, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select 
                    value={editProductData.category}
                    onChange={(e) => setEditProductData({ 
                      ...editProductData, 
                      category: e.target.value,
                      categoryLabel: e.target.options[e.target.selectedIndex].text
                    })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                  >
                    <option value="college-merch">College Merch</option>
                    <option value="engineering-models">Engineering Models</option>
                    <option value="figurines">Figurines</option>
                    <option value="home-decor">Home & Décor</option>
                    <option value="event-merch">Fest Merch</option>
                    <option value="alumni-gifting">Alumni Gifting</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Badge Tag</label>
                  <input 
                    type="text"
                    value={editProductData.badge}
                    onChange={(e) => setEditProductData({ ...editProductData, badge: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sale Price (₹) *</label>
                  <input 
                    type="number"
                    required
                    min="100"
                    value={editProductData.salePrice}
                    onChange={(e) => setEditProductData({ ...editProductData, salePrice: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Regular MRP (₹)</label>
                  <input 
                    type="number"
                    min="100"
                    value={editProductData.regularPrice}
                    onChange={(e) => setEditProductData({ ...editProductData, regularPrice: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>
              </div>

              <MediaUploader 
                mediaUrls={editUploadedImages} 
                setMediaUrls={setEditUploadedImages} 
              />

              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Description</label>
                <textarea 
                  rows={3}
                  value={editProductData.description}
                  onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#00714C]"
                />
              </div>

              <button 
                type="submit"
                disabled={updatingProduct}
                className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-3.5 rounded-xl shadow transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Edit3 size={14} />
                <span>{updatingProduct ? 'Updating...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
