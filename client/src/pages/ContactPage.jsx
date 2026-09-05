import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import axios from 'axios';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await axios.post('/api/contact', formData);
      if (res.data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="bg-[#00714C]/10 text-[#00714C] border border-[#00714C]/30 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          📍 DIRECT EVENT COMMUNICATION
        </span>
        <h1 className="font-['Cinzel'] text-3xl sm:text-4xl font-extrabold text-gray-900">
          Contact ACET CAMRI
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Reach out to our event coordinators for registration inquiries, training program details, or campus location assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="font-['Cinzel'] font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
              Event Location & Coordinators
            </h3>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <strong className="block text-gray-900">Centre for Additive Manufacturing and Innovation (CAMRI)</strong>
                  <span>Akshaya College of Engineering & Technology, Kinathukadavu, Coimbatore – 642 109</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <strong className="block text-gray-900">Event Coordinators</strong>
                  <span>Mr. B. Sudhakar (AP/Mech): 8610599083</span><br/>
                  <span>Mr. R. Gowtham (AP/Mech): 99408 31085</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <strong className="block text-gray-900">Direct Email</strong>
                  <span>info@acetcbe.edu.in</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <strong className="block text-gray-900">Working Hours</strong>
                  <span>Monday – Saturday: 8:30 AM – 5:30 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Link / Campus Directions */}
          <div className="bg-[#00714C] text-white rounded-3xl p-6 space-y-2 shadow-sm">
            <h4 className="font-['Cinzel'] font-bold text-sm">Need In-Person Consultation?</h4>
            <p className="text-xs text-stone-200">
              Walk into our 3D Printing Lab during lab hours to inspect raw material resins, inspect 50-micron prints, and consult on capstones.
            </p>
            <a 
              href="https://maps.google.com/?q=Akshaya+College+of+Engineering+and+Technology+Kinathukadavu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFDA0F] hover:underline pt-2"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Right Col: Interactive Inquiry Form */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <h3 className="font-['Cinzel'] font-bold text-lg text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <MessageSquare size={18} className="text-[#00714C]" />
            <span>Send Us a Message</span>
          </h3>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-[#eef9f3] border border-[#aee6cb] rounded-2xl animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-[#00714C] text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="font-['Cinzel'] text-lg font-bold text-gray-900">Inquiry Received!</h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Thank you for getting in touch. Our 3D lab team will review your message and reply via email or phone within 24 hours.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. S. Manikandan"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@acetcbe.edu.in"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">WhatsApp / Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 97894 44111"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Subject / Inquiry Type</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Bulk Fest Trophies Order"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Your Message / Project Details *</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your design specifications, quantity, or query..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#00714C]"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#00714C] hover:bg-[#005a3c] text-white font-bold py-3.5 rounded-xl shadow hover:shadow-md transition-all text-xs flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>{submitting ? 'Submitting Message...' : 'Send Inquiry to Lab Desk ➔'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
