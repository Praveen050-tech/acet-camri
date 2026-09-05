import React from 'react';
import { motion } from 'framer-motion';

export const RefundPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16 font-['Public_Sans']">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-['Cinzel'] text-4xl font-bold text-[#00714C] mb-8">Refund Policy</h1>
          
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 space-y-8 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Standard Products</h2>
              <p>
                Ready-to-buy products from the CAMRI Store may be eligible for replacement if they arrive damaged. Due to the nature of 3D printing, minor surface variations or layer lines are inherent to the process and are not considered defects.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Custom Manufactured Items</h2>
              <p>
                Custom-manufactured products are produced specifically according to the customer's submitted requirements and are generally non-returnable and non-refundable. Replacement may be considered for significant transportation damage, major manufacturing failure, or severe warping affecting functionality, subject to CAMRI verification.
              </p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
                <p className="font-bold text-yellow-800 mb-1">Transit Damage Claims</p>
                <p className="text-yellow-700">
                  For transit damage claims, the customer must provide a continuous unboxing video from the unopened package and report the issue within 48 hours of delivery.
                </p>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};
