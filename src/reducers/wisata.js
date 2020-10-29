import {
  GET_PLACES,
  SEARCH,
  SEARCH_ERROR,
  GET_PLACE_COMMENT,
  GET_PLACE_DETAIL,
  GET_PLACE,
  GET_EKSPLORASI,
  GET_TYPE_PLACE,
  GET_WISATA_DAERAH,
  WISATA_DAERAH_ERROR,
  EKSPLORASI_ERROR,
  TYPE_PLACE_ERROR,
  GET_PLACE_BYTYPE,
  ADD_COMMENT,
  ADD_COMMENT_ERROR,
  PLACES_ERROR,
  PLACES_REQUEST,
} from '../actions/types';

const initialState = {
  appliedFilter: [],
  filteredPlaces: [],
  places: [],
  place: {},
  typePlace: [],
  eksplorasi: [],
  placeComments: [],
  error: {},
  loading: true,
  hasMore: true,
  page: 1,
  limit: 12,
  isFetching: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case PLACES_REQUEST:
      return {
        ...state,
        isFetching: true,
        page: action.page,
        limit: action.limit,
        hasMore: true,
      };
    case GET_PLACES:
      return Object.assign({}, state, {
        isFetching: false,
        filteredPlaces: state.filteredPlaces.concat(payload),
        places: state.places.concat(payload),
        hasMore: action.hasMore,
      });
    case GET_TYPE_PLACE:
      return {
        ...state,
        typePlace: payload,
      };
    case GET_PLACE_DETAIL:
      return {
        ...state,
        place: payload,
        loading: false,
      };
    case GET_PLACE:
      return {
        ...state,
        places: payload,
        filteredPlaces: payload,
        loading: false,
      };
    case GET_PLACE_BYTYPE:
      return {
        ...state,
        places: payload,
      };
    case GET_WISATA_DAERAH:
      return {
        ...state,
        wisataDaerah: payload,
        loading: false,
      };
    case GET_EKSPLORASI:
      return {
        ...state,
        eksplorasi: payload,
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        place: {
          ...state.place,
          comments: payload,
        },
        loading: false,
      };
    case GET_PLACE_COMMENT:
      return {
        ...state,
        placeComments: payload,
        loading: false,
      };
    case SEARCH:
      let newState = Object.assign({}, state);
      let value = payload.value;
      let filteredValue = state.places.filter(place => {
        return (
          place.name_place.toLowerCase().includes(value) ||
          place.provinsi.toLowerCase().includes(value)
        );
      });
      let appliedFilters = state.appliedFilter;

      if (value) {
        appliedFilters = addFilterIfNotExists(SEARCH, appliedFilters);
        newState.filteredPlaces = filteredValue;
      } else {
        appliedFilters = removeFilter(SEARCH, appliedFilters);
        if (appliedFilters.length === 0) {
          newState.filteredPlaces = newState.places;
        }
      }
      return newState;

    case ADD_COMMENT_ERROR:
    case SEARCH_ERROR:
    case WISATA_DAERAH_ERROR:
    case EKSPLORASI_ERROR:
    case PLACES_ERROR:
    case TYPE_PLACE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}

function addFilterIfNotExists(filter, appliedFilters) {
  let index = appliedFilters.indexOf(filter);
  if (index === -1) appliedFilters.push(filter);

  return appliedFilters;
}

function removeFilter(filter, appliedFilters) {
  let index = appliedFilters.indexOf(filter);
  appliedFilters.splice(index, 1);
  return appliedFilters;
}
