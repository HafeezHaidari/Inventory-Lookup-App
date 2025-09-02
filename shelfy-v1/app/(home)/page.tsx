import AppLogo from "@/components/AppLogo";
import SearchBar from "@/components/SearchBar";
import ProductCardPresenter from "@/components/ProductCardPresenter";

export default function Home() {
  return (
      <>
          <AppLogo />
          <SearchBar />
          <ProductCardPresenter />
      </>
  );
}
