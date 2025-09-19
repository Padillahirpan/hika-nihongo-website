import HiraganaCard from "./HiraganaCard";
import EmptyCard from "./EmptyCard";
import { groupByCategory } from "../util/unlock-logic";

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
  <div className="w-full h-[20px] mt-16 rounded-lg mb-4 flex items-center justify-center" />
);

export const KanaSection = ({ title, data }) => {
  const groupedData = groupByCategory(data);

  // Category mapping with their respective configurations
  const categories = [
    { key: "1", data: groupedData["1"], columns: 5 }, // Basic kana
    // { key: "2", data: groupedData["2"], columns: 5 }, // Sokuon
    { key: "3", data: groupedData["3"], columns: 5 }, // Dakuon
    { key: "4", data: groupedData["4"], columns: 5 }, // Dakuon two
    { key: "5", data: groupedData["5"], columns: 3 }, // Youon
  ];

  return (
    <>
      {categories.map((category, index) => (
        <div key={category.key}>
          <KanaGrid data={category.data} columns={category.columns} />
          {index < categories.length - 1 && <SectionSpacer />}
        </div>
      ))}
    </>
  );
};