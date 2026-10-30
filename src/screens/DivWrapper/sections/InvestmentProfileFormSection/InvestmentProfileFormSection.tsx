import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

type ExperienceOption = {
  title: string;
  description: string;
  icon: string;
  selected?: boolean;
};

type GoalOption = {
  title: string;
  description: string;
  icon: string;
  selected?: boolean;
};

type StyleOption = {
  title: string;
  icon: string;
  selected?: boolean;
};

const experienceOptions: ExperienceOption[] = [
  {
    title: "처음이에요",
    description: "해외주식 계좌 개설이 처음이거나 입문 단계예요",
    icon: "/margin-2.svg",
    selected: true,
  },
  {
    title: "1년 미만",
    description: "미국 지수나 대형주를 조금씩 사보고 있어요",
    icon: "/margin.svg",
  },
  {
    title: "3년 이상",
    description: "어닝콜 분석, 레버리지 및 파생상품도 익숙해요",
    icon: "/margin.svg",
  },
];

const goalOptions: GoalOption[] = [
  {
    title: "꾸준한 자산 증식",
    description: "안정적 인덱스 ETF",
    icon: "/container-14.svg",
    selected: true,
  },
  {
    title: "단기 고수익 추구",
    description: "변동성 모멘텀 공략",
    icon: "/container-13.svg",
  },
  {
    title: "달러 배당 연금화",
    description: "매달 들어오는 현금 흐름",
    icon: "/container-5.svg",
  },
  {
    title: "글로벌 혁신 동행",
    description: "빅테크 장기 가치투자",
    icon: "/container-7.svg",
  },
];

const styleOptions: StyleOption[] = [
  {
    title: "소수점·주식 모으기",
    icon: "/container-12.svg",
    selected: true,
  },
  {
    title: "AI 어닝콜 실시간 분석",
    icon: "/container-11.svg",
    selected: true,
  },
  {
    title: "대형 성장주 (엔비디아·애플)",
    icon: "/container-10.svg",
    selected: true,
  },
  {
    title: "고배당 ETF (SCHD)",
    icon: "/container-9.svg",
  },
  {
    title: "주주 커뮤니티 인사이트",
    icon: "/container.svg",
  },
  {
    title: "미국 지수 패시브 (VOO·QQQ)",
    icon: "/container-2.svg",
  },
  {
    title: "월배당 커버드콜 (JEPI)",
    icon: "/container-4.svg",
  },
  {
    title: "기술적 지표 단기 트레이딩",
    icon: "/container-3.svg",
  },
  {
    title: "프리·애프터마켓 변동성 공략",
    icon: "/container-1.svg",
  },
];

export const InvestmentProfileFormSection = (): JSX.Element => {
  const [experience, setExperience] = useState(
    experienceOptions.findIndex((option) => option.selected),
  );
  const [goal, setGoal] = useState(
    goalOptions.findIndex((option) => option.selected),
  );
  const [styles, setStyles] = useState<number[]>(
    styleOptions.reduce<number[]>(
      (selected, option, index) =>
        option.selected ? [...selected, index] : selected,
      [],
    ),
  );

  const toggleStyle = (index: number) => {
    setStyles((current) =>
      current.includes(index)
        ? current.filter((selectedIndex) => selectedIndex !== index)
        : [...current, index],
    );
  };

  return (
    <section className="flex w-full flex-col items-start gap-8 px-5 pt-0">
      <section className="flex w-full flex-col items-start gap-3">
        <header className="flex w-full items-baseline justify-between">
          <h2 className="[font-family:'Plus_Jakarta_Sans',Helvetica] text-[19px] font-semibold leading-[26px] tracking-[0] text-[#161c25]">
            해외주식 경험이 있으신가요?
          </h2>
          <span className="[font-family:'WenQuanYi_Zen_Hei-Medium',Helvetica] text-[11px] font-medium leading-[14px] tracking-[0] text-[#0059b9]">
            필수
          </span>
        </header>
        <Card className="w-full rounded-2xl border-[#d7e2ff66] bg-[#eff4ff] p-3.5 shadow-none">
          <CardContent className="flex flex-col gap-2.5 p-0">
            {experienceOptions.map((option, index) => {
              const isSelected = experience === index;

              return (
                <Button
                  key={option.title}
                  type="button"
                  variant="ghost"
                  h-auto
                  onClick={() => setExperience(index)}
                  className={`flex w-full items-center justify-between rounded-xl border bg-white p-4 text-left shadow-[0px_1px_2px_#0000000d] hover:bg-white ${
                    isSelected ? "border-[#0059b9]" : "border-[#c1c6d64c]"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="flex min-w-0 flex-col items-start gap-0.5">
                    <span className="[font-family:'WenQuanYi_Zen_Hei-Medium',Helvetica] text-[17px] font-medium leading-6 text-[#161c25]">
                      {option.title}
                    </span>
                    <span className="[font-family:'Plus_Jakarta_Sans',Helvetica] text-[13px] font-normal leading-[18px] text-[#414754]">
                      {option.description}
                    </span>
                  </span>
                  <img
                    className="ml-3 h-6 w-9 shrink-0"
                    alt=""
                    src={isSelected ? "/margin-2.svg" : option.icon}
                  />
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </section>
      <section className="flex w-full flex-col items-start gap-3">
        <header className="flex w-full items-start justify-between gap-4">
          <h2 className="[font-family:'Plus_Jakarta_Sans',Helvetica] text-[19px] font-semibold leading-[26px] tracking-[0] text-[#161c25]">
            가장 기대하는 투자 목적은 무엇인가요?
          </h2>
          <span className="shrink-0 pt-2.5 text-right [font-family:'Plus_Jakarta_Sans',Helvetica] text-[11px] font-medium leading-[14px] tracking-[0] text-[#414754]">
            단일 선택
          </span>
        </header>
        <Card className="w-full rounded-2xl border-[#d7e2ff66] bg-[#eff4ff] p-3.5 shadow-none">
          <CardContent className="grid w-full grid-cols-2 gap-2.5 p-0">
            {goalOptions.map((option, index) => {
              const isSelected = goal === index;

              return (
                <Button
                  key={option.title}
                  type="button"
                  variant="ghost"
                  h-auto
                  onClick={() => setGoal(index)}
                  className={`flex min-h-[85px] flex-col items-start justify-between rounded-xl border bg-white p-3 text-left shadow-[0px_1px_2px_#0000000d] hover:bg-white ${
                    isSelected ? "border-[#0059b9]" : "border-[#c1c6d64c]"
                  }`}
                  aria-pressed={isSelected}
                >
                  <img
                    className="h-6 w-6 object-contain object-left"
                    alt=""
                    src={option.icon}
                  />
                  <span className="flex flex-col items-start pt-1.5">
                    <span className="[font-family:'Plus_Jakarta_Sans',Helvetica] text-[13px] font-bold leading-[17.9px] text-[#161c25]">
                      {option.title}
                    </span>
                    <span className="[font-family:'Plus_Jakarta_Sans',Helvetica] text-[11px] font-bold leading-[14px] text-[#414754]">
                      {option.description}
                    </span>
                  </span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </section>
      <section className="flex w-full flex-col items-start gap-3">
        <header className="flex w-full items-baseline justify-between gap-4">
          <h2 className="[font-family:'Plus_Jakarta_Sans',Helvetica] text-[19px] font-semibold leading-[26px] tracking-[0] text-[#161c25]">
            관심 있는 투자 스타일
          </h2>
          <span className="shrink-0 [font-family:'Plus_Jakarta_Sans',Helvetica] text-[13px] font-normal leading-[18px] tracking-[0] text-[#414754]">
            다중 선택 가능
          </span>
        </header>
        <div className="flex w-full flex-wrap content-start gap-2.5">
          {styleOptions.map((option, index) => {
            const isSelected = styles.includes(index);

            return (
              <Button
                key={option.title}
                type="button"
                variant="ghost"
                h-auto
                onClick={() => toggleStyle(index)}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-white px-3.5 py-2 shadow-[0px_1px_2px_#0000000d] hover:bg-white ${
                  isSelected
                    ? "border-[#0059b9] text-[#0059b9]"
                    : "border-[#c1c6d64c] text-[#161c25]"
                }`}
                aria-pressed={isSelected}
              >
                <img
                  className="h-4 w-4 shrink-0 object-contain"
                  alt=""
                  src={option.icon}
                />
                <span
                  className={`whitespace-nowrap [font-family:'Plus_Jakarta_Sans',Helvetica] text-[13px] font-semibold leading-[18px] ${
                    isSelected ? "text-[#0059b9]" : "text-[#161c25]"
                  }`}
                >
                  {option.title}
                </span>
              </Button>
            );
          })}
        </div>
      </section>
      <aside className="flex w-full items-center gap-3 rounded-xl bg-[#eff4ff] p-4">
        <img className="h-8 w-8 shrink-0" alt="" src="/background.svg" />
        <p className="[font-family:'Plus_Jakarta_Sans',Helvetica] text-[13px] font-normal leading-[17.9px] text-[#414754]">
          성향 분석 후에도 프로필 설정에서 언제든 자유롭게 수정할 수 있어요.
        </p>
      </aside>
    </section>
  );
};
