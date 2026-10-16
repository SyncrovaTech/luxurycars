//D:\D-Luxury-Car-Showroom\Frontend\src\components\splash\SplashScreen.tsx
import { useEffect, useState } from "react";
import "../../styles/components/splash/SplashScreen.css";

interface BMWIntroProps {
  onComplete: () => void;
}

export default function BMWIntro({ onComplete }: BMWIntroProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // 2.2 સેકન્ડે લોગો મોટો થઈને સ્ક્રીન પાર જશે
    // 3.1 સેકન્ડે સ્પ્લેશ ગાયબ
    const closeTimer = window.setTimeout(() => {
      setClosing(true);
    }, 3000);

    // 3.4 સેકન્ડે હોમ પેજ ઓપન
    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 3400);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`bmw-intro ${closing ? "bmw-intro--closing" : ""}`}>
      <div className="bmw-intro__background" />

      <div className="bmw-intro__content">
        {/* ઝૂમ થતો લોગો */}
        <div className="bmw-intro__zoom-container">
          <div className="bmw-intro__logo-wrapper">
            <div className="bmw-intro__ring bmw-intro__ring--outer" />
            <div className="bmw-intro__ring bmw-intro__ring--middle" />
            <div className="bmw-intro__ring bmw-intro__ring--inner" />

            <img
              src="/bmw-logo.png"
              alt="BMW"
              className="bmw-intro__logo"
            />
          </div>
        </div>

        {/* લખાણ (જે ઝૂમ વખતે ગાયબ થશે) */}
        <div className="bmw-intro__text-group">
          <div className="bmw-intro__line" />
          <h1 className="bmw-intro__title">BMW</h1>
          <p className="bmw-intro__subtitle">
            THE ULTIMATE DRIVING EXPERIENCE
          </p>
        </div>
      </div>

      <div className="bmw-intro__loader">
        <span />
      </div>
    </div>
  );
}