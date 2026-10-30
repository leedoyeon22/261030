import { Button } from "../../components/ui/button";
import { InvestmentProfileFormSection } from "./sections/InvestmentProfileFormSection/InvestmentProfileFormSection";
import { InvestmentProfileIntroSection } from "./sections/InvestmentProfileIntroSection";

export const DivWrapper = (): JSX.Element => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center overflow-y-auto bg-[#f8f9ff]">
      <div className="flex min-h-screen w-full max-w-md flex-col bg-[#f8f9ff]">
        <div className="flex w-[90%] self-center flex-col">
          <InvestmentProfileIntroSection />
          <InvestmentProfileFormSection />
        </div>
        <footer className="sticky bottom-0 z-10 mt-auto w-full bg-[linear-gradient(0deg,rgba(248,249,255,1)_0%,rgba(248,249,255,0.95)_50%,rgba(248,249,255,0)_100%)] p-4">
          <Button
            type="button"
            className="relative flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0059b9] p-0 text-white shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a] hover:bg-[#0052aa]"
          >
            <span className="[font-family:'Plus_Jakarta_Sans',Helvetica] text-center text-[15px] font-bold leading-5 tracking-[0]">
              분석결과 확인하기
            </span>
            <img
              className="h-auto w-auto"
              src="/container-8.svg"
              alt=""
              aria-hidden="true"
            />
          </Button>
        </footer>
      </div>
    </main>
  );
};
