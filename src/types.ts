export interface Node {
    address: string;
    location?: {
        lat: number;
        lng: number;
        country: string;
        city: string;
    }
}

export interface ApiResponse {
    network: string;
    nodes: Node[]
}
