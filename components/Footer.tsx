import React from 'react';
import { PiggyBank, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <PiggyBank className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold">SaveBox</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              The smartest way to save for your dreams. AI-powered planning, goal visualization, and secure tracking in one app.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-emerald-400">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Download</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-emerald-400">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Legal</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2024 SaveBox Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
             <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
             <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};