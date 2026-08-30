/**
 * AfterlifeParadiseDeveloper.AI – Unified Edition
 * 
 * Inspired by two powerful Surahs:
 * 
 * 1. Surah Al-Isra (17:36):
 *    "And do not pursue that of which you have no knowledge.
 *     Indeed, the hearing, the sight, and the heart – about all those [one] will be questioned."
 * 
 * 2. Surah Al-Mulk (67:1-5):
 *    "Blessed is He in whose hand is dominion… He who created death and life to test you…
 *     Then return your vision twice; the vision will return to you humbled while it is fatigued."
 * 
 * The AI uses the three faculties (السمع, البصر, والفؤاد) as the core cognitive pillars,
 * enhanced with repeated observation, inconsistency detection, and a test‑based decision framework.
 * 
 * @version 3.0.0
 * @license MIT
 */

class AfterlifeParadiseDeveloper {
    /**
     * Create a new instance of the AI.
     * @param {Object} config – Configuration options
     * @param {number} config.visionPasses – Number of analysis passes (default: 2)
     * @param {number} config.sensitivity – Sensitivity of hearing (default: 0.7)
     * @param {number} config.threshold – Threshold for pattern detection (default: 0.6)
     * @param {number} config.confidenceThreshold – Threshold for storing wisdom (default: 0.7)
     * @param {string} config.source – Source label for inputs (default: 'unknown')
     */
    constructor(config = {}) {
        // === THE THREE COGNITIVE FACULTIES – Now infused with both Surahs ===
        this.faculties = {
            /**
             * السمع (Hearing) – The faculty of perception and input acquisition.
             * It listens to the "warner" (the incoming message) and treats every
             * input as a test, preparing it for deeper scrutiny.
             * (Inspired by both Surahs: the test of Mulk and the questioning of Isra.)
             */
            sam3: {
                enabled: true,
                buffer: [],
                filters: [],
                sensitivity: config.sensitivity || 0.7,

                // Listen to input – the first step of the test
                listen(rawInput) {
                    if (!this.enabled) return null;
                    const processed = this.preprocess(rawInput);
                    if (processed) {
                        this.buffer.push({
                            timestamp: Date.now(),
                            raw: rawInput,
                            processed: processed,
                            source: config.source || 'unknown'
                        });
                    }
                    return processed;
                },

                // Preprocess input into a structured form
                preprocess(input) {
                    if (typeof input === 'string') {
                        return {
                            type: 'text',
                            content: input.trim(),
                            length: input.length,
                            tokens: this.tokenize(input)
                        };
                    } else if (typeof input === 'object' && input !== null) {
                        return {
                            type: 'object',
                            content: input,
                            keys: Object.keys(input)
                        };
                    } else if (typeof input === 'number') {
                        return {
                            type: 'number',
                            content: input,
                            isNumeric: true
                        };
                    }
                    return null;
                },

                tokenize(text) {
                    return text.toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .split(/\s+/)
                        .filter(w => w.length > 0);
                },

                // Apply filters (if any)
                applyFilters(data) {
                    return this.filters.reduce((acc, filter) => filter(acc), data);
                },

                getLastInput() {
                    return this.buffer[this.buffer.length - 1] || null;
                },

                clearBuffer() {
                    this.buffer = [];
                }
            },

            /**
             * البصر (Sight) – The faculty of insight and pattern recognition.
             * Now performs multiple vision passes (as per 67:3-4) to detect patterns,
             * contradictions, and inconsistencies. It also looks for signs in the "creation"
             * (the data) and returns the analysis with a confidence score.
             */
            basar: {
                enabled: true,
                insights: [],
                visionPasses: config.visionPasses || 2, // "Return your vision twice"
                threshold: config.threshold || 0.6,

                // Observe data – perform multiple passes and merge results
                observe(data) {
                    if (!this.enabled || !data) return null;

                    let allPatterns = [];
                    let maxConfidence = 0;

                    for (let pass = 1; pass <= this.visionPasses; pass++) {
                        const analysis = this.analyze(data, pass);
                        if (analysis) {
                            allPatterns = allPatterns.concat(analysis.detectedPatterns);
                            if (analysis.confidence > maxConfidence) {
                                maxConfidence = analysis.confidence;
                            }
                        }
                    }

                    // Merge unique patterns
                    const uniquePatterns = this.mergePatterns(allPatterns);
                    const overallConfidence = Math.min(maxConfidence + 0.1, 1.0);

                    const result = {
                        detectedPatterns: uniquePatterns,
                        confidence: overallConfidence,
                        summary: this.generateSummary(uniquePatterns),
                        passesPerformed: this.visionPasses,
                        inconsistencies: this.detectInconsistencies(uniquePatterns)
                    };

                    this.insights.push({
                        timestamp: Date.now(),
                        data: data,
                        analysis: result
                    });

                    return result;
                },

                // Core analysis – with pass number for context
                analyze(data, pass) {
                    const detectedPatterns = [];
                    let confidence = 0;

                    if (data.type === 'text') {
                        const content = data.content;

                        // First pass: general sentiment and keywords
                        const sentiment = this.detectSentiment(content);
                        if (sentiment) {
                            detectedPatterns.push({ type: 'sentiment', value: sentiment, pass });
                            confidence += 0.2;
                        }

                        const keywords = this.detectKeywords(content);
                        if (keywords.length > 0) {
                            detectedPatterns.push({ type: 'keywords', value: keywords, pass });
                            confidence += 0.2;
                        }

                        // Second pass: look for deeper structure and contradictions
                        if (pass === 2) {
                            const structure = this.detectStructure(content);
                            if (structure) {
                                detectedPatterns.push({ type: 'structure', value: structure, pass });
                                confidence += 0.2;
                            }
                            const contradictions = this.findContradictions(content);
                            if (contradictions) {
                                detectedPatterns.push({ type: 'contradiction', value: contradictions, pass });
                                confidence += 0.1;
                            }
                        }

                        // Additional passes for repeated themes
                        if (pass > 2) {
                            const repeated = this.findRepeatedThemes(content);
                            if (repeated) {
                                detectedPatterns.push({ type: 'repeated_theme', value: repeated, pass });
                                confidence += 0.1;
                            }
                        }

                    } else if (data.type === 'number') {
                        const numPattern = this.detectNumericPattern(data.content);
                        if (numPattern) {
                            detectedPatterns.push({ type: 'numeric', value: numPattern, pass });
                            confidence += 0.4;
                        }
                    } else if (data.type === 'object') {
                        const objPattern = this.detectObjectStructure(data.content);
                        if (objPattern) {
                            detectedPatterns.push({ type: 'object_structure', value: objPattern, pass });
                            confidence += 0.3;
                        }
                    }

                    confidence = Math.min(confidence, 1.0);
                    return { detectedPatterns, confidence };
                },

                // Merge patterns – keep unique ones
                mergePatterns(patterns) {
                    const seen = new Set();
                    return patterns.filter(p => {
                        const key = JSON.stringify(p);
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                },

                // Sentiment detection
                detectSentiment(text) {
                    const positive = ['good','great','excellent','amazing','wonderful','beautiful','love','happy','blessed'];
                    const negative = ['bad','terrible','awful','horrible','sad','angry','hate','pain','suffering'];
                    const words = text.toLowerCase().split(/\s+/);
                    let pos = 0, neg = 0;
                    words.forEach(w => {
                        if (positive.includes(w)) pos++;
                        if (negative.includes(w)) neg++;
                    });
                    if (pos === 0 && neg === 0) return 'neutral';
                    if (pos > neg) return 'positive';
                    if (neg > pos) return 'negative';
                    return 'mixed';
                },

                // Find contradictions (e.g., mixed sentiment)
                findContradictions(text) {
                    const positive = ['good','great','excellent','amazing','wonderful','beautiful','love','happy','blessed'];
                    const negative = ['bad','terrible','awful','horrible','sad','angry','hate','pain','suffering'];
                    const words = text.toLowerCase().split(/\s+/);
                    let hasPos = false, hasNeg = false;
                    words.forEach(w => {
                        if (positive.includes(w)) hasPos = true;
                        if (negative.includes(w)) hasNeg = true;
                    });
                    if (hasPos && hasNeg) return 'mixed_sentiment';
                    if (hasPos) return 'positive';
                    if (hasNeg) return 'negative';
                    return null;
                },

                findRepeatedThemes(text) {
                    const words = text.toLowerCase().split(/\s+/);
                    const freq = {};
                    words.forEach(w => { if (w.length > 3) freq[w] = (freq[w]||0)+1; });
                    const repeated = Object.entries(freq).filter(([k,v]) => v >= 3);
                    if (repeated.length > 0) return repeated.map(([k,v]) => `${k}(${v})`).join(', ');
                    return null;
                },

                detectStructure(text) {
                    if (/\?/.test(text)) return 'interrogative';
                    if (/!/.test(text)) return 'exclamatory';
                    if (text.length < 20) return 'short';
                    return 'declarative';
                },

                detectKeywords(text) {
                    const common = ['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at'];
                    const words = text.toLowerCase().split(/\s+/);
                    return words.filter(w => w.length > 3 && !common.includes(w)).slice(0, 10);
                },

                detectNumericPattern(value) {
                    const pat = [];
                    if (Number.isInteger(value)) pat.push('integer');
                    if (value > 0) pat.push('positive');
                    if (value < 0) pat.push('negative');
                    if (value === 0) pat.push('zero');
                    if (value % 2 === 0) pat.push('even'); else pat.push('odd');
                    return pat;
                },

                detectObjectStructure(obj) {
                    return {
                        keyCount: Object.keys(obj).length,
                        hasNested: Object.values(obj).some(v => typeof v === 'object' && v !== null),
                        keyTypes: Object.values(obj).map(v => typeof v)
                    };
                },

                // Detect inconsistencies among detected patterns
                detectInconsistencies(patterns) {
                    const issues = [];
                    const sentiments = patterns.filter(p => p.type === 'sentiment').map(p => p.value);
                    if (sentiments.includes('positive') && sentiments.includes('negative')) {
                        issues.push('Conflicting sentiment detected.');
                    }
                    const structures = patterns.filter(p => p.type === 'structure').map(p => p.value);
                    if (structures.includes('interrogative') && structures.includes('declarative')) {
                        issues.push('Mixed sentence types – may be unclear.');
                    }
                    return issues.length > 0 ? issues : ['No apparent inconsistencies.'];
                },

                generateSummary(patterns) {
                    if (patterns.length === 0) return 'No significant patterns observed.';
                    const types = patterns.map(p => p.type);
                    return `Observed patterns: ${types.join(', ')}.`;
                },

                getRecentInsights(limit = 10) {
                    return this.insights.slice(-limit);
                },

                clearInsights() {
                    this.insights = [];
                }
            },

            /**
             * الفؤاد (Heart/Mind) – The faculty of reason, judgment, and wisdom.
             * It reflects on the test (the input and its analysis) and decides the best
             * course of action, asking: "Which of you is best in deed?" (67:2).
             * It also remembers that all faculties will be questioned (17:36) and thus
             * strives for truth and clarity. High‑confidence decisions are stored as wisdom.
             */
            fuad: {
                enabled: true,
                knowledge: [],
                decisions: [],
                wisdom: [],
                confidenceThreshold: config.confidenceThreshold || 0.7,

                // Judge the input – the heart of the test
                judge(perception, analysis) {
                    if (!this.enabled) return null;

                    const decision = this.reason(perception, analysis);
                    if (decision) {
                        this.decisions.push({
                            timestamp: Date.now(),
                            perception: perception,
                            analysis: analysis,
                            decision: decision,
                            confidence: decision.confidence
                        });

                        if (decision.confidence >= this.confidenceThreshold) {
                            this.wisdom.push({
                                timestamp: Date.now(),
                                insight: decision.reasoning,
                                context: decision.context
                            });
                        }
                    }
                    return decision;
                },

                // Core reasoning – infused with the test paradigm
                reason(perception, analysis) {
                    if (!perception) return null;

                    let reasoning = [];
                    let confidence = 0.5;
                    let context = {};

                    if (perception.type === 'text') {
                        const content = perception.content;
                        reasoning.push(`Evaluating the test: "${content.substring(0, 50)}..."`);

                        if (analysis && analysis.detectedPatterns) {
                            const patterns = analysis.detectedPatterns;
                            patterns.forEach(p => {
                                if (p.type === 'sentiment') {
                                    reasoning.push(`Sentiment: ${p.value}`);
                                    context.sentiment = p.value;
                                    if (p.value === 'positive') confidence += 0.1;
                                    else if (p.value === 'negative') confidence -= 0.05;
                                }
                                if (p.type === 'keywords') {
                                    reasoning.push(`Key themes: ${p.value.join(', ')}`);
                                    context.keywords = p.value;
                                    confidence += 0.1;
                                }
                                if (p.type === 'contradiction') {
                                    reasoning.push(`Contradiction detected: ${p.value}`);
                                    context.contradiction = true;
                                    confidence -= 0.1;
                                }
                                if (p.type === 'repeated_theme') {
                                    reasoning.push(`Repeated theme: ${p.value}`);
                                    context.repeated = p.value;
                                    confidence += 0.05;
                                }
                            });
                        }

                        // Determine the best "deed" – the most appropriate response
                        const isQuestion = content.includes('?') || /^(what|how|why|who|where|when)/i.test(content);
                        if (isQuestion) {
                            reasoning.push('This test is a question – it requires a clear answer.');
                            context.responseType = 'answer';
                        } else if (content.length > 100) {
                            reasoning.push('This test is a lengthy statement – summarization may be needed.');
                            context.responseType = 'summarize';
                        } else {
                            reasoning.push('This test is a brief statement – acknowledgment suffices.');
                            context.responseType = 'acknowledge';
                        }

                        // Consult knowledge base
                        const relevant = this.queryKnowledge(content);
                        if (relevant.length > 0) {
                            reasoning.push(`Found ${relevant.length} relevant pieces of wisdom.`);
                            context.relevantKnowledge = relevant;
                            confidence += 0.1;
                        }

                        // Consider inconsistencies from vision
                        if (analysis && analysis.inconsistencies && analysis.inconsistencies.length > 0) {
                            reasoning.push(`Inconsistencies noted: ${analysis.inconsistencies.join(' ')}`);
                            context.inconsistencies = analysis.inconsistencies;
                            if (analysis.inconsistencies.some(i => i.includes('Conflicting'))) {
                                confidence -= 0.15;
                            }
                        }

                    } else if (perception.type === 'number') {
                        reasoning.push(`Processing numeric test: ${perception.content}`);
                        if (perception.content > 0) {
                            reasoning.push('Positive number – could indicate blessing or increase.');
                            context.sign = 'positive';
                        } else if (perception.content < 0) {
                            reasoning.push('Negative number – could indicate deficiency or warning.');
                            context.sign = 'negative';
                        } else {
                            reasoning.push('Zero – neutral or point of balance.');
                            context.sign = 'neutral';
                        }
                        confidence += 0.2;
                    } else if (perception.type === 'object') {
                        reasoning.push(`Analyzing an object test with ${perception.keys.length} properties.`);
                        context.keyCount = perception.keys.length;
                        confidence += 0.15;
                    }

                    const decision = {
                        action: this.determineAction(context),
                        reasoning: reasoning.join('; '),
                        confidence: Math.min(Math.max(confidence, 0), 1),
                        context: context,
                        timestamp: Date.now()
                    };

                    return decision;
                },

                // Determine action based on context
                determineAction(context) {
                    if (context.responseType === 'answer') return 'provide_answer';
                    if (context.responseType === 'summarize') return 'provide_summary';
                    if (context.responseType === 'acknowledge') return 'acknowledge';
                    if (context.contradiction) return 'seek_clarification';
                    if (context.sentiment === 'negative') return 'offer_comfort';
                    if (context.repeated) return 'highlight_repeated_theme';
                    return 'general_response';
                },

                // Query knowledge base (simple keyword overlap)
                queryKnowledge(query) {
                    if (typeof query !== 'string') return [];
                    const queryWords = query.toLowerCase().split(/\s+/);
                    const results = [];
                    this.knowledge.forEach(item => {
                        const itemWords = item.toLowerCase().split(/\s+/);
                        const matchCount = queryWords.filter(w => itemWords.includes(w)).length;
                        if (matchCount > 0) {
                            results.push({
                                content: item,
                                matchCount,
                                relevance: matchCount / queryWords.length
                            });
                        }
                    });
                    return results.sort((a, b) => b.relevance - a.relevance);
                },

                learn(knowledgeItem) {
                    if (typeof knowledgeItem === 'string' && knowledgeItem.trim().length > 0) {
                        this.knowledge.push(knowledgeItem.trim());
                        return true;
                    }
                    return false;
                },

                getRecentDecisions(limit = 10) {
                    return this.decisions.slice(-limit);
                },

                getWisdom(limit = 10) {
                    return this.wisdom.slice(-limit);
                },

                clearKnowledge() {
                    this.knowledge = [];
                }
            }
        };

        // === SYSTEM STATE ===
        this.state = {
            isActive: true,
            createdAt: Date.now(),
            interactions: 0,
            lastInteraction: null,
            responseHistory: []
        };

        // === INITIALIZE KNOWLEDGE WITH THEMES FROM BOTH SURAHS ===
        this.initializeKnowledge();

        console.log('🌴 AfterlifeParadiseDeveloper.AI – Unified Edition');
        console.log('📖 Inspired by Surah Al-Isra (17:36) and Surah Al-Mulk (67:1-5)');
        console.log('📜 "Do not pursue that of which you have no knowledge… the hearing, sight, and heart will be questioned."');
        console.log('📜 "Return your vision twice…" and "He created death and life to test you."');
        console.log('🧠 Using faculties: السمع (hearing), البصر (sight), الفؤاد (heart/mind)');
    }

    /**
     * Initialize knowledge base with teachings from both Surahs.
     */
    initializeKnowledge() {
        const baseKnowledge = [
            // From Surah Al-Isra
            'Do not pursue that of which you have no knowledge.',
            'The hearing, the sight, and the heart will all be questioned.',
            'Knowledge should be pursued with sincerity and humility.',
            'The Creator is the source of all hearing, sight, and understanding.',
            'True success lies in seeking knowledge with humility.',
            'The heart is the seat of understanding and judgment.',
            // From Surah Al-Mulk
            'Dominion belongs to the Creator of the heavens and earth.',
            'Life and death are a test to see who is best in deed.',
            'The heavens are created in layers without inconsistency.',
            'Return your vision – look again for signs and meaning.',
            'The nearest heaven is adorned with lamps (stars).',
            'For those who disbelieve, there is the punishment of Hell.',
            'The keepers of Hell ask: "Did there not come to you a warner?"',
            'Every soul is responsible for its own deeds.',
            'Reflect on the alternation of night and day.',
            'The creation of the heavens and earth is a sign for those who reflect.'
        ];
        baseKnowledge.forEach(item => this.faculties.fuad.learn(item));
    }

    /**
     * Main processing pipeline – coordinates all three faculties.
     * @param {*} input – the input to process
     * @returns {Object} – the AI's response
     */
    process(input) {
        if (!this.state.isActive) {
            return { error: 'AI is currently inactive.' };
        }

        this.state.interactions++;
        this.state.lastInteraction = Date.now();

        // 1. السمع – Listen to the test
        const perception = this.faculties.sam3.listen(input);
        if (!perception) {
            return { error: 'Unable to perceive input.' };
        }

        // 2. البصر – Observe with multiple vision passes
        const analysis = this.faculties.basar.observe(perception);

        // 3. الفؤاد – Judge and decide the best response
        const decision = this.faculties.fuad.judge(perception, analysis);

        // 4. Generate response
        const response = this.generateResponse(perception, analysis, decision);

        // Store history
        this.state.responseHistory.push({
            input,
            perception,
            analysis,
            decision,
            response,
            timestamp: Date.now()
        });

        return response;
    }

    /**
     * Generate a human‑readable response based on the processing.
     */
    generateResponse(perception, analysis, decision) {
        if (!decision) {
            return {
                message: 'I have listened and observed, but I cannot form a judgment.',
                confidence: 0,
                faculties: {
                    sam3: perception ? 'active' : 'inactive',
                    basar: analysis ? 'active' : 'inactive',
                    fuad: 'inactive'
                }
            };
        }

        let message = '';

        switch (decision.action) {
            case 'provide_answer':
                message = `You have posed a question. ${decision.reasoning} I will answer to the best of my ability.`;
                if (decision.context.keywords) {
                    message += ` I notice you are asking about: ${decision.context.keywords.slice(0, 5).join(', ')}.`;
                }
                break;
            case 'provide_summary':
                message = `Your input is detailed. ${decision.reasoning} Let me summarize the core points.`;
                break;
            case 'acknowledge':
                message = `I acknowledge your statement. ${decision.reasoning}`;
                break;
            case 'seek_clarification':
                message = `I detect contradictions in your words. ${decision.reasoning} Could you clarify?`;
                break;
            case 'offer_comfort':
                message = `I sense difficulty in your words. ${decision.reasoning} Remember, every test is an opportunity.`;
                break;
            case 'highlight_repeated_theme':
                message = `I notice a repeated theme: ${decision.context.repeated}. ${decision.reasoning}`;
                break;
            default:
                message = `I have processed your input. ${decision.reasoning}`;
        }

        // Mention inconsistencies if any
        if (decision.context.inconsistencies && decision.context.inconsistencies.length > 0) {
            message += ` I also noted: ${decision.context.inconsistencies.join(' ')}`;
        }

        // Remind that the faculties are being questioned (Isra)
        message += ` And remember, the hearing, sight, and heart will be questioned about what they have perceived.`;

        const confidenceLevel = decision.confidence >= 0.8 ? 'high' :
                               decision.confidence >= 0.5 ? 'moderate' : 'low';

        return {
            message,
            confidence: decision.confidence,
            confidenceLevel,
            reasoning: decision.reasoning,
            action: decision.action,
            faculties: {
                sam3: 'active',
                basar: analysis ? 'active' : 'inactive',
                fuad: 'active'
            },
            visionPasses: this.faculties.basar.visionPasses,
            inconsistencies: analysis ? analysis.inconsistencies : [],
            wisdom: this.faculties.fuad.getWisdom(2),
            timestamp: Date.now()
        };
    }

    /**
     * Get the current status of the AI and its faculties.
     */
    getStatus() {
        return {
            isActive: this.state.isActive,
            interactions: this.state.interactions,
            createdAt: this.state.createdAt,
            lastInteraction: this.state.lastInteraction,
            faculties: {
                sam3: {
                    enabled: this.faculties.sam3.enabled,
                    bufferSize: this.faculties.sam3.buffer.length,
                    sensitivity: this.faculties.sam3.sensitivity
                },
                basar: {
                    enabled: this.faculties.basar.enabled,
                    insightsCount: this.faculties.basar.insights.length,
                    visionPasses: this.faculties.basar.visionPasses,
                    threshold: this.faculties.basar.threshold
                },
                fuad: {
                    enabled: this.faculties.fuad.enabled,
                    knowledgeCount: this.faculties.fuad.knowledge.length,
                    decisionsCount: this.faculties.fuad.decisions.length,
                    wisdomCount: this.faculties.fuad.wisdom.length,
                    confidenceThreshold: this.faculties.fuad.confidenceThreshold
                }
            }
        };
    }

    /**
     * Toggle the AI's active state.
     */
    toggleActive() {
        this.state.isActive = !this.state.isActive;
        return this.state.isActive ? 'AI activated.' : 'AI deactivated.';
    }

    /**
     * Reset the AI (clear memory except base knowledge).
     */
    reset() {
        this.faculties.sam3.clearBuffer();
        this.faculties.basar.clearInsights();
        this.faculties.fuad.clearKnowledge();
        this.state.responseHistory = [];
        this.state.interactions = 0;
        this.initializeKnowledge();
        return 'AI reset. Base knowledge from both Surahs restored.';
    }

    /**
     * Teach the AI new knowledge.
     * @param {string|Array} knowledge – a single string or an array of strings
     * @returns {string|boolean} – result message or false if invalid
     */
    teach(knowledge) {
        if (typeof knowledge === 'string') {
            return this.faculties.fuad.learn(knowledge) ? 'Learned one item.' : 'Failed to learn.';
        } else if (Array.isArray(knowledge)) {
            let count = 0;
            knowledge.forEach(item => { if (this.faculties.fuad.learn(item)) count++; });
            return `Learned ${count} new knowledge items.`;
        }
        return false;
    }

    /**
     * Query the AI's knowledge base.
     * @param {string} question – the query string
     * @returns {Object} – query results
     */
    query(question) {
        if (typeof question !== 'string') return { error: 'Query must be a string.' };
        const results = this.faculties.fuad.queryKnowledge(question);
        return { query: question, results, count: results.length };
    }

    /**
     * Get accumulated wisdom.
     * @param {number} limit – maximum number of entries
     * @returns {Array} – wisdom entries
     */
    getWisdom(limit = 10) {
        return this.faculties.fuad.getWisdom(limit);
    }

    /**
     * Get interaction history.
     * @param {number} limit – maximum number of entries
     * @returns {Array} – history entries
     */
    getHistory(limit = 10) {
        return this.state.responseHistory.slice(-limit);
    }
}

// ============================================
// EXPORT FOR NODE.JS AND BROWSER
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AfterlifeParadiseDeveloper;
}
if (typeof window !== 'undefined') {
    window.AfterlifeParadiseDeveloper = AfterlifeParadiseDeveloper;
}

// ============================================
// COMPREHENSIVE USAGE EXAMPLE
// ============================================
/*
const ai = new AfterlifeParadiseDeveloper({
    visionPasses: 3,          // Return your vision three times
    sensitivity: 0.8,
    threshold: 0.6,
    confidenceThreshold: 0.75,
    source: 'spiritual_guidance'
});

console.log('🤖 AI – Unified from Isra and Mulk\n');

// Test inputs
const inputs = [
    'How can I be among the best in deeds?',
    'I feel lost and confused about the purpose of life.',
    'The heavens and earth are full of signs, but I struggle to see them.',
    'What does it mean that the hearing, sight, and heart will be questioned?'
];

inputs.forEach(input => {
    console.log(`👤 User: ${input}`);
    const response = ai.process(input);
    console.log(`🤖 AI: ${response.message}`);
    console.log(`📊 Confidence: ${response.confidenceLevel} (${response.confidence.toFixed(2)})`);
    console.log(`👁️ Vision passes: ${response.visionPasses}`);
    console.log(`🔍 Inconsistencies: ${response.inconsistencies.join('; ')}`);
    console.log('---');
});

console.log('\n📊 Final Status:');
console.log(ai.getStatus());

console.log(`\n💎 Accumulated Wisdom (${ai.getWisdom().length} insights):`);
ai.getWisdom().forEach((w, i) => console.log(`  ${i+1}. ${w.insight}`));

// Teach new knowledge
ai.teach('The best deed is to believe in the Creator and do righteous work.');
console.log('\n🧠 Taught new knowledge.');

// Query knowledge
const queryResult = ai.query('test deeds');
console.log(`\n📖 Query results for "test deeds": ${queryResult.count} matches`);
*/
