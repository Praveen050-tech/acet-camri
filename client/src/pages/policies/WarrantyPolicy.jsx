import React from 'react';
import { Award, ShieldCheck, Wrench } from 'lucide-react';

export const WarrantyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 bg-white">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold text-[#00714C] uppercase tracking-wider block mb-1">
          MECHANICAL & KINEMATIC GUARANTEES
        </span>
        <h1 className="font-['Cinzel'] text-3xl font-extrabold text-gray-900">Mechanical Warranty Policy</h1>
        <p className="text-xs text-gray-500 mt-1">Guaranteed Performance on Functional Assemblies</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <Award size={18} className="text-[#00714C]" /> 1. 6-Month Mechanical Warranty on Gearboxes & Kinematics
          </h3>
          <p>
            All functional engineering assemblies (including planetary gearboxes, dual-rotor turbines, differential gears, and cutaway engines) include a comprehensive <strong>6-month mechanical warranty</strong> from the date of collection/delivery.
          </p>
          <p>
            If any internal gear teeth, bearing races, or interlocking pivot shafts experience shear failure or premature fatigue under standard demonstration loads (up to 400 RPM / 2.5 Nm torque), we will replace the sub-assembly or complete mechanism free of charge.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-['Outfit'] font-bold text-base text-gray-900 flex items-center gap-2">
            <Wrench size={18} className="text-[#00714C]" /> 2. Warranty Exclusions
          </h3>
          <p>
            Warranty does not cover intentional over-torquing beyond rated specifications, exposure to open flames or chemical solvents, or physical impact breakage from high drops.
          </p>
        </section>

      </div>
    </div>
  );
};
