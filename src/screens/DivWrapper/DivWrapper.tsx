import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  InvestmentProfileFormSection,
  type InvestmentProfileSelection,
} from "./sections/InvestmentProfileFormSection/InvestmentProfileFormSection";
import { InvestmentProfileIntroSection } from "./sections/InvestmentProfileIntroSection";

const initialSelection: InvestmentProfileSelection = {
  experience: "처음이에요",
  goal: "꾸준한 자산 증식",
  styles: [
    "소수점·주식 모으기",
    "AI 어닝콜 실시간 분석",
    "대형 성장주 (엔비디아·애플)",
  ],
};

const getProfileSummary = (selection: InvestmentProfileSelection) => {
  if (selection.goal === "단기 고수익 추구") {
    return {
      title: "적극적인 성장·기회 추구형",
      description: "가격 변동과 시장 흐름을 살피며 투자 기회를 찾는 성향이에요. 변동성이 큰 상품은 손실 가능성도 함께 확인하는 것이 중요해요.",
      focus: "분산 투자, 손실 한도 설정, 매매 원칙 점검",
    };
  }
  if (selection.goal === "달러 배당 연금화") {
    return {
      title: "현금흐름 중시형",
      description: "정기적인 배당과 현금흐름을 중요하게 생각하는 성향이에요. 배당률뿐 아니라 배당 지속 가능성과 환율도 함께 살펴보세요.",
      focus: "배당 지속성, 분배금 변동, 환율 및 세금 확인",
    };
  }
  if (selection.goal === "글로벌 혁신 동행") {
    return {
      title: "장기 성장·혁신 추구형",
      description: "글로벌 기업의 기술과 장기 성장 가능성에 관심이 많은 성향이에요. 특정 산업이나 종목에 집중되지 않도록 점검해 보세요.",
      focus: "기업 실적, 산업 전망, 포트폴리오 분산",
    };
  }
  return {
    title: "꾸준한 자산 증식형",
    description: "장기적인 자산 형성과 꾸준한 투자 습관을 중요하게 생각하는 성향이에요. 시장 전체에 분산하는 방식과 투자 기간을 함께 고려해 보세요.",
    focus: "장기 분산 투자, 정기 점검, 투자 기간 설정",
  };
};

export const DivWrapper = (): JSX.Element => {
  const [selection, setSelection] = useState<InvestmentProfileSelection>(initialSelection);
  const [showResult, setShowResult] = useState(false);
  const summary = getProfileSummary(selection);

  return (
    <main className="flex min-h-screen w-full flex-col items-center overflow-y-auto bg-[#f8f9ff]">
      <div className="flex min-h-screen w-full max-w-md flex-col bg-[#f8f9ff]">
        <div className="flex w-[90%] self-center flex-col">
          <InvestmentProfileIntroSection />
          {!showResult ? (
            <InvestmentProfileFormSection onSelectionChange={setSelection} />
          ) : (
            <section className="flex w-full flex-col gap-5 px-5 pb-8">
              <div className="rounded-2xl border border-[#cbdcff] bg-white p-5 shadow-sm">
                <p className="text-xs font-bold text-[#0059b9]">YOUR INVESTMENT PROFILE</p>
                <h2 className="mt-2 text-2xl font-bold text-[#161c25]">{summary.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#414754]">{summary.description}</p>
                <div className="mt-5 rounded-xl bg-[#eff4ff] p-4">
                  <p className="text-xs font-bold text-[#0059b9]">추천 점검 포인트</p>
                  <p className="mt-1 text-sm font-semibold text-[#161c25]">{summary.focus}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d7e2ff] bg-white p-5">
                <h3 className="font-bold text-[#161c25]">선택한 투자 프로필</h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-[#6b7280]">해외주식 경험</dt>
                    <dd className="mt-1 font-semibold text-[#161c25]">{selection.experience}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6b7280]">투자 목적</dt>
                    <dd className="mt-1 font-semibold text-[#161c25]">{selection.goal}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6b7280]">관심 투자 스타일</dt>
                    <dd className="mt-1 font-semibold leading-6 text-[#161c25]">
                      {selection.styles.length ? selection.styles.join(" · ") : "선택한 스타일 없음"}
                    </dd>
                  </div>
                </dl>
              </div>

              <p className="text-xs leading-5 text-[#6b7280]">
                이 결과는 입력한 응답을 바탕으로 만든 참고용 성향 안내이며, 특정 금융상품의 매수·매도를 권유하지 않아요.
              </p>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-xl border-[#0059b9] text-[#0059b9]"
                onClick={() => setShowResult(false)}
              >
                투자 성향 다시 설정하기
              </Button>
            </section>
          )}
        </div>
        {!showResult && (
          <footer className="sticky bottom-0 z-10 mt-auto w-full bg-[linear-gradient(0deg,rgba(248,249,255,1)_0%,rgba(248,249,255,0.95)_50%,rgba(248,249,255,0)_100%)] p-4">
            <Button
              type="button"
              className="relative flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0059b9] p-0 text-white shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a] hover:bg-[#0052aa]"
              onClick={() => setShowResult(true)}
            >
              <span className="[font-family:'Plus_Jakarta_Sans',Helvetica] text-center text-[15px] font-bold leading-5 tracking-[0]">
                분석결과 확인하기
              </span>
              <img className="h-5 w-5" src="/container-8.svg" alt="" aria-hidden="true" />
            </Button>
          </footer>
        )}
      </div>
    </main>
  );
};
