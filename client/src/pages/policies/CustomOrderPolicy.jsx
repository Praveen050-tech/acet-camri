import React from 'react';
import { motion } from 'framer-motion';

export const CustomOrderPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16 font-['Public_Sans']">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-['Cinzel'] text-4xl font-bold text-[#00714C] mb-8">Custom Manufacturing & Legal Policy</h1>
          
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 space-y-8 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Custom Manufacturing & Refund Policy</h2>
              <p>
                Custom-manufactured products are produced specifically according to the customer's submitted requirements and are generally non-returnable and non-refundable. Replacement may be considered for significant transportation damage, major manufacturing failure, or severe warping affecting functionality, subject to CAMRI verification.
              </p>
              <p className="mt-4">
                For transit damage claims, the customer must provide a continuous unboxing video from the unopened package and report the issue within 48 hours of delivery.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Restricted / Prohibited Printing</h2>
              <p className="mb-2">CAMRI strictly prohibits the printing of the following items:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Weapons and firearm components/accessories.</li>
                <li>Weapon conversion or unlawful-use components.</li>
                <li>Lock-picking tools.</li>
                <li>Illegal items or items intended to facilitate unlawful activity.</li>
                <li>Sexually explicit/NSFW models.</li>
                <li>Copyright-infringing reproductions where the customer lacks authorization.</li>
                <li>Any other item prohibited by applicable law, institutional policy or CAMRI safety policy.</li>
              </ul>
              <p className="mt-4 font-bold text-red-600">
                CAMRI reserves the right to reject, suspend or cancel a printing request immediately if it violates law, institutional policy, safety requirements or the website's acceptable-use policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Intellectual Property and Confidentiality</h2>
              <p className="mb-2">
                Customers must confirm that they have the necessary rights, permissions, or authorization to reproduce uploaded files. Customer CAD/model files will not be publicly accessible and will be stored securely.
              </p>
              <p>
                CAMRI treats customer designs and project information as confidential, except where disclosure is required by law or necessary for fulfilling the requested service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Design Liability</h2>
              <p>
                Unless design consultancy has been explicitly requested and accepted, the customer remains responsible for the functional suitability of the submitted design. CAMRI is not liable for failures arising from customer design flaws such as insufficient wall thickness, zero/insufficient clearance, incorrect tolerances, unsuitable geometry, inadequate load assumptions, or inappropriate material selection.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};
