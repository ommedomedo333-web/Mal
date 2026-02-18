import React, { useEffect, useRef, useState } from 'react';

interface MazeGameProps {
    language: 'ar' | 'en';
}

const MazeGame: React.FC<MazeGameProps> = ({ language }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

    // Maze state
    const ballRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, radius: 10 });
    const mazeRef = useRef<number[][]>([]);
    const cellSize = 40;
    const cols = 15;
    const rows = 15;

    const requestPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                if (permission === 'granted') {
                    setPermissionGranted(true);
                } else {
                    setPermissionGranted(false);
                }
            } catch (error) {
                console.error('Error requesting device orientation permission:', error);
                setPermissionGranted(false);
            }
        } else {
            // Non-iOS devices usually don't need explicit permission
            setPermissionGranted(true);
        }
    };

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            // beta: -180 to 180 (front to back)
            // gamma: -90 to 90 (left to right)
            const x = event.gamma || 0; // left/right
            const y = event.beta || 0;  // front/back
            setTilt({ x, y });
        };

        if (permissionGranted) {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [permissionGranted]);

    // Generate a simple maze
    useEffect(() => {
        const maze: number[][] = [];
        for (let r = 0; r < rows; r++) {
            maze[r] = [];
            for (let c = 0; c < cols; c++) {
                // Simple border and some random walls
                if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
                    maze[r][c] = 1;
                } else if (Math.random() > 0.8) {
                    // Don't place walls in the middle where the text is
                    const midR = Math.floor(rows / 2);
                    const midC = Math.floor(cols / 2);
                    if (Math.abs(r - midR) > 1 || Math.abs(c - midC) > 1) {
                        maze[r][c] = 1;
                    } else {
                        maze[r][c] = 0;
                    }
                } else {
                    maze[r][c] = 0;
                }
            }
        }
        mazeRef.current = maze;

        // Initial ball position
        ballRef.current.x = cellSize * 1.5;
        ballRef.current.y = cellSize * 1.5;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const update = () => {
            const ball = ballRef.current;
            const maze = mazeRef.current;

            // Apply tilt to velocity
            ball.vx += tilt.x * 0.12; // Increased sensitivity
            ball.vy += tilt.y * 0.12; // Increased sensitivity

            // Friction
            ball.vx *= 0.94;
            ball.vy *= 0.94;

            // Update position
            const nextX = ball.x + ball.vx;
            const nextY = ball.y + ball.vy;

            // Basic collision detection
            const checkCollision = (px: number, py: number) => {
                const c = Math.floor(px / cellSize);
                const r = Math.floor(py / cellSize);
                if (maze[r] && maze[r][c] === 1) return true;

                // Check edges of ball
                const edges = [
                    { x: px - ball.radius, y: py },
                    { x: px + ball.radius, y: py },
                    { x: px, y: py - ball.radius },
                    { x: px, y: py + ball.radius }
                ];

                for (const edge of edges) {
                    const ec = Math.floor(edge.x / cellSize);
                    const er = Math.floor(edge.y / cellSize);
                    if (maze[er] && maze[er][ec] === 1) return true;
                }

                return false;
            };

            if (!checkCollision(nextX, ball.y)) {
                ball.x = nextX;
            } else {
                ball.vx *= -0.6; // bounce
            }

            if (!checkCollision(ball.x, nextY)) {
                ball.y = nextY;
            } else {
                ball.vy *= -0.6; // bounce
            }

            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw maze
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            for (let r = 0; r < rows; r++) {
                for (let c = 0; r < rows && c < cols; c++) {
                    if (maze[r][c] === 1) {
                        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                    }
                }
            }

            // Draw "ELATYAB" in middle - made smaller as requested
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('ELATYAB', (cols * cellSize) / 2, (rows * cellSize) / 2);

            // Draw ball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ff6b6b';
            ctx.fill();
            ctx.closePath();

            animationId = requestAnimationFrame(update);
        };

        update();

        return () => cancelAnimationFrame(animationId);
    }, [tilt]);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center p-4">
            <div className="relative bg-black/40 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
                <canvas
                    ref={canvasRef}
                    width={cols * cellSize}
                    height={rows * cellSize}
                    className="max-w-full h-auto"
                />

                {permissionGranted === null && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6 text-center">
                        <h3 className="text-white font-black mb-4">
                            {language === 'ar' ? 'لعبة المتاهة التفاعلية' : 'Interactive Maze Game'}
                        </h3>
                        <p className="text-white/60 text-sm mb-6">
                            {language === 'ar' ? 'استخدم مستشعر الجاذبية في هاتفك لتحريك الكرة.' : 'Use your phone\'s gyroscope to move the ball.'}
                        </p>
                        <button
                            onClick={requestPermission}
                            className="bg-fruit-primary text-white px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all"
                        >
                            {language === 'ar' ? 'ابدأ اللعب' : 'Start Playing'}
                        </button>
                    </div>
                )}

                {permissionGranted === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6 text-center">
                        <p className="text-white/60 text-sm">
                            {language === 'ar' ? 'تحتاج للموافقة على استخدام المستشعرات.' : 'Permission to use sensors is required.'}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center ae-3">
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
                    {language === 'ar' ? 'قم بإمالة هاتفك' : 'Tilt your phone to play'}
                </p>
            </div>
        </div>
    );
};

export default MazeGame;
