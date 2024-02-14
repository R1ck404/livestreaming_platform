interface StreamSettings {
    chat_enabled: boolean;
    slow_mode_enabled: boolean;
    slow_mode_delay: number;
    command_prefix: string;
    commands: StreamCommand[];
}

interface StreamCommand {
    name: string;
    response: string;
    is_public: boolean;
    is_enabled: boolean;
}