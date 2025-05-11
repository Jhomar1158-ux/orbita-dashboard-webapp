'use client';

import SolarSystem from '../../components/SolarSystem';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import testsData from '../../data/tests-data';

interface ResultDetail {
    name: string;
    progress: number;
    description?: string;
    color?: string;
}

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const [testName, setTestName] = useState('');
    const [testInfo, setTestInfo] = useState<any>(null);
    const [results, setResults] = useState<{
        name: string;
        progress: number;
        color: string;
        route: string;
        description?: string;
    }[]>([]);
    const [selectedResult, setSelectedResult] = useState<ResultDetail | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const testResults = localStorage.getItem(`test_${params.id}_results`);
        if (testResults) {
            const data = JSON.parse(testResults);
            setTestName(data.testName);
            
            // Get test info for dimension descriptions
            const test = testsData.find(t => t.route === params.id);
            setTestInfo(test);
            
            // Format results based on the data
            const formattedResults = Object.entries(data.results).map(([key, value], index) => {
                // Get dimension description if available
                let description = '';
                if (test && test.dimensions) {
                    const dimensionIndex = test.dimensions.findIndex(d => d.toLowerCase() === key.toLowerCase());
                    if (dimensionIndex >= 0) {
                        description = getDimensionDescription(key, value as number);
                    }
                }
                
                return {
                    name: formatDimensionName(key),
                    progress: value as number,
                    color: ["#7be495", "#4f8cff", "#ffb347", "#ff6f69", "#a580ff", "#67dfe0"][index % 6],
                    route: `#${key}`,
                    description: description || getResultDescription(key, value as number)
                };
            });
            setResults(formattedResults);
        }
    }, [params.id]);

    const formatDimensionName = (name: string): string => {
        // Convert camelCase to Title Case
        if (name.match(/[A-Z]/)) {
            return name.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
        }
        
        // Convert snake_case to Title Case
        if (name.includes('_')) {
            return name.split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        
        // Capitalize first letter
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const getDimensionDescription = (dimension: string, score: number): string => {
        // Custom descriptions for RIASEC dimensions
        const riasecDescriptions: { [key: string]: { [level: string]: string } } = {
            realista: {
                high: "Tienes una fuerte orientación hacia actividades prácticas y manuales. Te destacas trabajando con herramientas, máquinas o en entornos al aire libre. Valoras lo concreto y tangible.",
                medium: "Muestras interés moderado en actividades prácticas y el trabajo manual. Puedes disfrutar trabajando con herramientas o en actividades físicas, pero lo balanceas con otros intereses.",
                low: "Muestras poco interés en actividades manuales, técnicas o que requieran trabajo físico. Probablemente prefieres actividades más abstractas o sociales."
            },
            investigativo: {
                high: "Tienes una fuerte inclinación hacia la investigación, el análisis y la resolución de problemas complejos. Disfrutas explorando ideas y buscando conocimiento. Valoras la precisión y la lógica.",
                medium: "Muestras un interés moderado en actividades analíticas e investigativas. Aprecias el conocimiento y la resolución de problemas, aunque lo balanceas con otros intereses.",
                low: "No muestras una preferencia marcada por actividades de investigación o análisis. Posiblemente prefieres tareas más prácticas o sociales que no requieran análisis detallado."
            },
            artistico: {
                high: "Posees una fuerte orientación creativa y artística. Valoras la autoexpresión, la originalidad y la estética. Disfrutas de actividades que te permiten usar tu imaginación y talento expresivo.",
                medium: "Muestras interés moderado en actividades creativas y artísticas. Aprecias la expresión personal y la innovación, aunque lo equilibras con otros intereses.",
                low: "No muestras una preferencia marcada por actividades artísticas o creativas. Probablemente te orientas más hacia enfoques convencionales o prácticos."
            },
            social: {
                high: "Tienes una fuerte orientación hacia las relaciones interpersonales. Disfrutas trabajando con personas, ayudando a otros y fomentando el desarrollo personal. Valoras la cooperación y el servicio.",
                medium: "Muestras interés moderado en actividades sociales y de ayuda. Aprecias las relaciones interpersonales, aunque lo equilibras con otros intereses.",
                low: "No muestras una preferencia marcada por actividades que impliquen ayudar o trabajar estrechamente con otras personas. Posiblemente prefieres tareas independientes o técnicas."
            },
            emprendedor: {
                high: "Posees una fuerte orientación hacia el liderazgo y la persuasión. Disfrutas influenciando a otros, tomando riesgos y persiguiendo objetivos ambiciosos. Valoras el éxito y la competitividad.",
                medium: "Muestras interés moderado en actividades de liderazgo y persuasión. Aprecias las oportunidades de influir e iniciar proyectos, aunque lo equilibras con otros intereses.",
                low: "No muestras una preferencia marcada por actividades que impliquen liderar, persuadir o emprender. Posiblemente prefieres roles de apoyo o técnicos."
            },
            convencional: {
                high: "Tienes una fuerte orientación hacia el orden, la estructura y los datos. Disfrutas con tareas sistemáticas, detalladas y bien definidas. Valoras la precisión, la estabilidad y la claridad.",
                medium: "Muestras interés moderado en actividades ordenadas y estructuradas. Aprecias la organización y los procedimientos claros, aunque lo equilibras con otros intereses.",
                low: "No muestras una preferencia marcada por actividades que requieran orden, detalle o seguir procedimientos establecidos. Posiblemente prefieres enfoques más flexibles o creativos."
            }
        };

        // Get dimension description if available
        const normalizedDimension = dimension.toLowerCase();
        if (riasecDescriptions[normalizedDimension]) {
            const level = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
            return riasecDescriptions[normalizedDimension][level];
        }

        // Generic description as fallback
        return getResultDescription(dimension, score);
    };

    const getResultDescription = (category: string, score: number): string => {
        // Default description for other dimensions
        return `Tu puntaje en ${formatDimensionName(category)} es ${score}%. Esto indica una ${score > 75 ? 'fuerte' : score > 50 ? 'moderada' : 'ligera'} afinidad con esta área.`;
    };

    const handleLearnMore = (result: any) => {
        setSelectedResult({
            name: result.name,
            progress: result.progress,
            description: result.description,
            color: result.color
        });
        setShowModal(true);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'url(/assets/img/tests/bg-tests.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            
            <SolarSystem data={results} onLearnMore={handleLearnMore} />
            
            <div style={{
                position: "absolute",
                top: 40,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                textAlign: "center"
            }}>
                <h1 style={{ fontSize: 55, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{testName}</h1>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 px-8 py-3 bg-[#4f8cff] text-white rounded-[.5rem] hover:bg-[#3b76e0] transition-colors duration-200 text-lg font-medium"
                >
                    Volver al inicio
                </button>
            </div>

            {/* Modal de detalles */}
            {showModal && selectedResult && (
                <>
                    <div className="fixed inset-0 bg-[#000000f5] z-40" onClick={() => setShowModal(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-8 max-w-lg w-full mx-4 relative border border-indigo-500/20 shadow-2xl">
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                onClick={() => setShowModal(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 rounded-full mr-4" style={{ backgroundColor: selectedResult.color || "#4f8cff" }}></div>
                                <h2 className="text-2xl font-bold text-white">{selectedResult.name}</h2>
                            </div>
                            <div className="mb-6">
                                <div className="w-full bg-gray-800 rounded-full h-4">
                                    <div
                                        className="h-4 rounded-full"
                                        style={{ width: `${selectedResult.progress}%`, backgroundColor: selectedResult.color || "#4f8cff" }}
                                    />
                                </div>
                                <div className="text-right text-sm text-gray-400 mt-1">
                                    {selectedResult.progress}%
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                {selectedResult.description}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}