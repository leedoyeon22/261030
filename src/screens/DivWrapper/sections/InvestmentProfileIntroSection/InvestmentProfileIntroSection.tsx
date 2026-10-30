export const InvestmentProfileIntroSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="investment-profile-title"
      className="flex w-full flex-col items-start px-5 pb-8 pt-2"
    >
      <div className="flex w-full flex-col items-start gap-[7.1px]">
        <div className="flex w-full flex-col items-start pb-[0.9px]">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eff4ff] px-2.5 py-1">
            <img
              className="h-auto w-auto shrink-0"
              alt="Container"
              src="/container-6.svg"
            />
            <span className="mt-[-1px] flex w-fit items-center whitespace-nowrap font-['Plus_Jakarta_Sans',Helvetica] text-[11px] font-bold leading-[14px] tracking-[0] text-[#0059b9]">
              맞춤형 해외주식 여정
            </span>
          </div>
        </div>
        <h1
          id="investment-profile-title"
          className="mt-[-1px] w-full font-['Plus_Jakarta_Sans',Helvetica] text-[26px] font-bold leading-[34px] tracking-[-0.65px] text-[#161c25]"
        >
          해외주식 투자 성향을
          <br />
          알려주세요
        </h1>
        <p className="mt-[-1px] w-full font-['Plus_Jakarta_Sans',Helvetica] text-[13px] font-normal leading-[21.1px] tracking-[0] text-[#414754]">
          작성해주신 정보는 회원님께 꼭 맞는 종목 알림과 글로벌 인사
          <br />
          이트 리포트를 큐레이션하는 데에만 사용돼요.
        </p>
      </div>
    </section>
  );
};
