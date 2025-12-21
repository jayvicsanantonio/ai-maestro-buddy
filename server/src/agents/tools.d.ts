import { SchemaType } from '@google-cloud/vertexai';
export declare const ToolRegistry: {
    analyze_audio_window: {
        description: string;
        parameters: {
            type: SchemaType;
            properties: {
                metrics: {
                    type: SchemaType;
                    items: {
                        type: SchemaType;
                        properties: {
                            offset: {
                                type: SchemaType;
                                description: string;
                            };
                            bpm: {
                                type: SchemaType;
                            };
                        };
                    };
                };
            };
            required: string[];
        };
    };
    set_metronome: {
        description: string;
        parameters: {
            type: SchemaType;
            properties: {
                bpm: {
                    type: SchemaType;
                };
            };
            required: string[];
        };
    };
    update_ui: {
        description: string;
        parameters: {
            type: SchemaType;
            properties: {
                message: {
                    type: SchemaType;
                };
                instruction: {
                    type: SchemaType;
                };
            };
            required: string[];
        };
    };
    reward_badge: {
        description: string;
        parameters: {
            type: SchemaType;
            properties: {
                type: {
                    type: SchemaType;
                };
                reason: {
                    type: SchemaType;
                };
            };
            required: string[];
        };
    };
    get_rhythm_exercises: {
        description: string;
        parameters: {
            type: SchemaType;
            properties: {
                level: {
                    type: SchemaType;
                    description: string;
                };
                style: {
                    type: SchemaType;
                    description: string;
                };
            };
        };
    };
};
//# sourceMappingURL=tools.d.ts.map