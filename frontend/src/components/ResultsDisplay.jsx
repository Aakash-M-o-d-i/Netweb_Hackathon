import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function ResultsDisplay({ result }) {
    const riskColor =
        result.risk_category === 'Low' ? 'var(--low-risk)' :
            result.risk_category === 'Medium' ? 'var(--medium-risk)' :
                'var(--high-risk)';

    const riskClass = result.risk_category.toLowerCase();

    // Prepare data for pie chart
    const pieData = [
        { name: 'Risk Score', value: result.risk_score },
        { name: 'Remaining', value: 100 - result.risk_score }
    ];

    const COLORS = [riskColor, 'rgba(148, 163, 184, 0.1)'];

    // Prepare data for factors bar chart
    const chartData = result.contributing_factors.slice(0, 5).map(factor => ({
        name: factor.factor.length > 20 ? factor.factor.substring(0, 20) + '...' : factor.factor,
        impact: factor.impact === 'High' ? 3 : factor.impact === 'Medium' ? 2 : 1
    }));

    return (
        <div className="card">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Risk Assessment Results
            </h2>

            {/* Risk Score Display */}
            <div style={{
                textAlign: 'center',
                padding: '2rem',
                background: `linear-gradient(135deg, ${riskColor}15, transparent)`,
                borderRadius: 'var(--radius-lg)',
                marginBottom: '2rem',
                border: `2px solid ${riskColor}30`
            }}>
                <div style={{
                    fontSize: '5rem',
                    fontWeight: '800',
                    color: riskColor,
                    fontFamily: 'Outfit',
                    marginBottom: '1rem',
                    textShadow: `0 0 30px ${riskColor}50`
                }}>
                    {result.risk_score}
                </div>
                <div className={`risk-badge ${riskClass}`} style={{
                    fontSize: '1.25rem',
                    padding: '0.75rem 2rem'
                }}>
                    {result.risk_category} Risk
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
                    Probability: {(result.probability * 100).toFixed(1)}%
                </p>
            </div>

            {/* Charts Section */}
            <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
                <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                }}>
                    <h3 style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}>
                        Risk Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                }}>
                    <h3 style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}>
                        Contributing Factors
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                                angle={-15}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                tick={{ fill: 'var(--text-secondary)' }}
                                ticks={[1, 2, 3]}
                                domain={[0, 3]}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                            />
                            <Bar dataKey="impact" fill={riskColor} radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Contributing Factors List */}
            {result.contributing_factors && result.contributing_factors.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>🔍 Risk Factors Identified</h3>
                    <div className="grid" style={{ gap: 'var(--spacing-sm)' }}>
                        {result.contributing_factors.map((factor, index) => (
                            <div
                                key={index}
                                style={{
                                    background: factor.impact === 'High'
                                        ? 'rgba(239, 68, 68, 0.1)'
                                        : factor.impact === 'Medium'
                                            ? 'rgba(245, 158, 11, 0.1)'
                                            : 'rgba(148, 163, 184, 0.05)',
                                    padding: 'var(--spacing-md)',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: `4px solid ${factor.impact === 'High'
                                        ? 'var(--high-risk)'
                                        : factor.impact === 'Medium'
                                            ? 'var(--medium-risk)'
                                            : 'var(--text-muted)'
                                        }`
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--spacing-xs)'
                                }}>
                                    <strong style={{ fontSize: '1.05rem' }}>{factor.factor}</strong>
                                    <span className={`risk-badge ${factor.impact.toLowerCase()}`} style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem'
                                    }}>
                                        {factor.impact}
                                    </span>
                                </div>
                                <div style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    marginBottom: 'var(--spacing-xs)'
                                }}>
                                    Value: {factor.value}
                                </div>
                                <div style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem'
                                }}>
                                    {factor.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
                <div className="alert alert-info">
                    <h3 style={{ marginBottom: '1rem' }}>📋 Recommended Actions</h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        display: 'grid',
                        gap: 'var(--spacing-xs)'
                    }}>
                        {result.recommendations.map((rec, index) => (
                            <li key={index} style={{
                                paddingLeft: '0.5rem',
                                fontSize: '0.95rem',
                                lineHeight: '1.6'
                            }}>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-sm)',
                marginTop: '2rem',
                flexWrap: 'wrap'
            }}>
                <button
                    className="btn btn-primary"
                    onClick={() => window.print()}
                >
                    🖨️ Print Report
                </button>
                <button
                    className="btn btn-outline"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    📝 New Assessment
                </button>
            </div>
        </div>
    );
}

export default ResultsDisplay;
