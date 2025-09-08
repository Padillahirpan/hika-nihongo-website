import HiraganaCard from "./HiraganaCard";
import EmptyCard from "./EmptyCard";

export const YouonSection = ({ title, data }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
        {data.map((item, index) => (
            <div key={index} className="flex justify-center">
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