export interface ICard {
    username: string; // Djas: username should not be null. Every card should have a user tied to it.
    id: number;
    card_art_url: string;
    image_url: string; // Djas: image_url should not be null. Every card should have an image_url right? Maybe I'm wrong.
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
    link_arrows: ILinkArrows;
}

export interface ILinkArrows {
    topLeft: boolean,
    top: boolean,
    topRight: boolean,
    left: boolean,
    right: boolean,
    bottomLeft: boolean,
    bottom: boolean,
    bottomRight: boolean,
};