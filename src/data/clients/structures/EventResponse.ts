export type Inquiries = {
    type: string,
    title: string,
    subtitle: string,
    required: boolean,
    options: [] //TODO: complete the options
}

export type Place = {
    address: string,
    zipCode: string,
    number: string,
    complement: string,
    country: string,
    city: string,
    state: string
}

export type RSVP = {
    openAt: string,
    closeAt: string
}

export type agendaSlot = {
    title: string,
    speaker: string,
    index: number,
    at: string
}

export type EventResponse = {
    _id: string,
    name: string,
    description: string,
    banner: string,
    seats: number,
    type: string,
    startAt: string,
    endAt: string,
    owner: string,
    organizers: string[],
    needsDocument: string,
    inquiries: Inquiries[],
    place: Place,
    rsvp: RSVP,
    attendees: [],
    waitingList: [],
    tags: string[],
    pictures: [],
    groups: string[],
    agenda: agendaSlot[],
    createdAt: string,
    updatedAt: string | null,
    deletedAt: string | null,
    publicSince: string 
}