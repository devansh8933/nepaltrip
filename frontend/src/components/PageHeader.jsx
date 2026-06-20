export default function PageHeader({ overline, title, subtitle }) {
  return (
    <section
      data-testid="page-header"
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#FAFAF8] border-b border-border overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#EAA015]/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-[#1C3144]/5 rounded-full blur-3xl" />
      </div>
      <div className="container-pad mx-auto relative">
        <p className="overline text-[#DC143C] mb-5">{overline}</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-[#1C3144] leading-[1.05] tracking-tight max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-base lg:text-lg text-[#4A4A4A] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
