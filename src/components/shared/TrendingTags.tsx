import { useGetTrendingTags } from "@/lib/react-query/queries";
import { Loader } from "@/components/shared";
import { Link } from "react-router-dom";

const TrendingTags = () => {
  const { data: trendingTags, isLoading } = useGetTrendingTags();

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="h3-bold text-light-1">Trending Tags</h3>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="flex flex-col gap-3">
          {trendingTags?.map((tag: { name: string; count: number }) => (
            <li key={tag.name}>
              <Link
                to={`/explore?q=${tag.name}`}
                className="flex flex-col gap-1 hover:bg-dark-4 p-2 rounded-lg transition"
              >
                <p className="body-bold text-light-1">#{tag.name}</p>
                <p className="small-medium text-light-3">{tag.count} posts</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrendingTags;
