import AppLogo from "@/components/AppLogo";
import SearchBar from "@/components/SearchBar";
import LandingProductsPresenter from "@/components/LandingProductsPresenter";

export default function Home() {
  return (
      <>
          <AppLogo />
          <SearchBar />
          <LandingProductsPresenter />
      </>
  );
}
