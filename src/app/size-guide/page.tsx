import { InfoPage } from "@/components/layout/InfoPage";

export default function SizeGuidePage() {
  return (
    <InfoPage 
      title="Size Guide" 
      description="Find your perfect fit. Detailed measurements for all our premium garments."
      content={
        <div className="space-y-12 mt-8">
          <p className="text-lg">Please note that all measurements are in inches. We recommend measuring a similar garment you already own that fits you well and comparing it to our size chart.</p>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Men's T-Shirts & Polos</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <table className="w-full text-sm text-center">
                <thead className="bg-black text-white dark:bg-white dark:text-black">
                  <tr>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Chest (Inches)</th>
                    <th className="px-6 py-4">Length (Inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-800"><td className="px-6 py-4 font-bold">M</td><td className="px-6 py-4">38</td><td className="px-6 py-4">27</td></tr>
                  <tr className="border-b border-gray-200 dark:border-gray-800"><td className="px-6 py-4 font-bold">L</td><td className="px-6 py-4">40</td><td className="px-6 py-4">28</td></tr>
                  <tr className="border-b border-gray-200 dark:border-gray-800"><td className="px-6 py-4 font-bold">XL</td><td className="px-6 py-4">42</td><td className="px-6 py-4">29</td></tr>
                  <tr><td className="px-6 py-4 font-bold">XXL</td><td className="px-6 py-4">44</td><td className="px-6 py-4">30</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ladies' Tops</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <table className="w-full text-sm text-center">
                <thead className="bg-black text-white dark:bg-white dark:text-black">
                  <tr>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Chest (Inches)</th>
                    <th className="px-6 py-4">Length (Inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-800"><td className="px-6 py-4 font-bold">S</td><td className="px-6 py-4">34</td><td className="px-6 py-4">25</td></tr>
                  <tr className="border-b border-gray-200 dark:border-gray-800"><td className="px-6 py-4 font-bold">M</td><td className="px-6 py-4">36</td><td className="px-6 py-4">26</td></tr>
                  <tr className="border-b border-gray-200 dark:border-gray-800"><td className="px-6 py-4 font-bold">L</td><td className="px-6 py-4">38</td><td className="px-6 py-4">27</td></tr>
                  <tr><td className="px-6 py-4 font-bold">XL</td><td className="px-6 py-4">40</td><td className="px-6 py-4">28</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    />
  );
}
