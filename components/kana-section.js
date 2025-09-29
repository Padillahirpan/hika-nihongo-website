import HiraganaCard from "./HiraganaCard";
import EmptyCard from "./EmptyCard";
import { groupByCategory } from "../util/unlock-logic";
import { getCategoryInfo } from "../util/category-info";

// Reusable component for rendering kana cards
const KanaGrid = ({ data, columns = 5 }) => {
  if (!data || data.length === 0) return null;

  // Use static classes for Tailwind CSS compatibility
  const gridClasses = {
    3: "grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4",
    5: "grid grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-2 sm:gap-4"
  };

  const gridClass = gridClasses[columns] || gridClasses[5];

  return (
    <div className={gridClass}>
      {data.map((item, index) => (
        <div key={`${item.character}-${index}`} className="flex justify-center">
          {item.character !== "-" ? (
            <HiraganaCard
              kana={item.character}
              romaji={item.romaji}
              masteryLevel={item.points}
              unlocked={item.unlocked}
            />
          ) : (
            <EmptyCard />
          )}
        </div>
      ))}
    </div>
  );
};

// Spacer component for consistent spacing
const SectionSpacer = () => (
  <div className="w-full h-[10px] rounded-lg mb-4 flex items-center justify-center" />
);

export const KanaSection = ({ title, data }) => {
  const groupedData = groupByCategory(data);

  // Category mapping with their respective configurations
  const categories = [
    { key: "1", data: groupedData["1"], columns: 5, title: "Gojuon" }, // Basic kana
    { key: "2", data: groupedData["2"], columns: 5, title: "Sokuon" }, // Sokuon
    { key: "3", data: groupedData["3"], columns: 5, title: "Dakuon & Handakuon" }, // Dakuon & Handakuon
    { key: "4", data: groupedData["4"], columns: 3, title: "Youon" }, // Youon
  ];

  return (
    <>
      {categories.map((category, index) => (
        <div key={category.key}>
          <div className="flex items-center gap-1 mb-2">
            <h2 className="text-lg sm:text-3xl font-bold text-left font-jakarta text-gray-800 dark:text-gray-100">{category.title}</h2>
            <button
              onClick={() => {
                // Show popup with category information
                alert(getCategoryInfo(category.title));
              }}
              className="mt-2 mb-2 hover:text-blue-500 transition-colors"
              title="Click for more information"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 md:w-6 md:h-6 text-gray-800 dark:text-gray-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </button>
          </div>
          <KanaGrid data={category.data} columns={category.columns} />
          {index < categories.length - 1 && <SectionSpacer />}
        </div>
      ))}
    </>
  );
};