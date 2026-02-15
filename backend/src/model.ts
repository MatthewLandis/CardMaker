export interface ICard {
    id: number;
    card_art_url: string;
    image_url?: string;
    title: string;
    title_style: string;
    template: string;
    pendulum_template: boolean;
    level: number;
    rank: number;
    n_level: number;
    attribute: string;
    primary_type: string;
    core_type: string;
    ability_type: string;
    last_type: string;
    effect_text: string;
    pendulum_effect_text?: string;
    pendulum_scale?: number;
    link_rating?: number;
    atk: number;
    def?: number;
    link_arrows?: IlinkArrows;
}

export interface IlinkArrows {
    topLeft: boolean,
    top: boolean,
    topRight: boolean,
    left: boolean,
    right: boolean,
    bottomLeft: boolean,
    bottom: boolean,
    bottomRight: boolean,
};