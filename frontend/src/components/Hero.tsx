type HeroProps = {
  topLabel?: string;
  tagline: string;
  bottomLabel?: string;
  imageUrl?: string;
  videoUrl?: string;
};

export function Hero({ topLabel, tagline, bottomLabel, imageUrl, videoUrl }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden -mt-20 bg-ink">
      {videoUrl ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          poster={imageUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : null}

      <div className="absolute inset-0 bg-ink/60" />

      {topLabel ? (
        <p
          className="absolute top-28 left-0 right-0 text-center label tracking-widest2 text-bone/85 px-6"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.55)" }}
        >
          {topLabel}
        </p>
      ) : null}

      <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
        <h1
          className="title text-bone text-3xl sm:text-5xl md:text-6xl max-w-4xl leading-[1.1] text-center"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.55)" }}
        >
          {tagline}
        </h1>
      </div>

      {bottomLabel ? (
        <p
          className="absolute bottom-12 left-0 right-0 text-center label tracking-widest2 text-bone/85 px-6"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.55)" }}
        >
          {bottomLabel}
        </p>
      ) : null}
    </section>
  );
}
