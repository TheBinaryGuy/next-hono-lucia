import React from 'react';

export function useTimer(initialSeconds = 60) {
    const [seconds, setSeconds] = React.useState(60);
    const [isActive, setIsActive] = React.useState(true);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const startTimer = () => {
        setSeconds(initialSeconds);
        setIsActive(true);
    };

    return { seconds, isActive, startTimer };
}
