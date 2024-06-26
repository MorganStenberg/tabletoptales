import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import styles from "../../styles/ReviewsPage.module.css";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import Review from "./Review";
import InfiniteScroll from "react-infinite-scroll-component";

import NoResults from "../../assets/no-results.png"
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import MostPopularReviews from "./MostPopularReviews";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function ReviewsPage({ message, filter = "" }) {
    const [reviews, setReviews] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();
    const currentUser = useCurrentUser();
    const [query, setQuery] = useState("");

    useEffect(() => {
        // Fetch reviews based on filter and search query
        const fetchReviews = async () => {
            try {
                const { data } = await axiosReq.get(`/reviews/?${filter}search=${query}`)
                setReviews(data)
                setHasLoaded(true)
            } catch (err) {
            }
        }

        // Delays fetching posts when user searches to improve UX
        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchReviews();
        }, 1000)
        return () => {
            clearTimeout(timer);
        }
    }, [filter, query, pathname, currentUser]);


    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={9}>
                {!currentUser && (
                <Col className="py-3 p-0">
                    <Container className="text-center">
                        <h4 className={styles.IntroHeader}>Welcome to TableTopTales, the best place for sharing board game reviews!</h4>
                        <Link className={styles.IntroSubHeader} to="/signup">
                        Sign up today and share your review!
                        </Link>
                    </Container>
                </Col>
                )}
                

                <MostPopularReviews smallscreen />
                <i className={` fa-solid fa-magnifying-glass ${styles.SearchIcon}`} />
                <Form
                    className={styles.SearchBar}
                    onSubmit={(event) => event.preventDefault()}>

                    <Form.Control
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="text"
                        className="mr-sm-2"
                        placeholder="Search for reviews, games or users" />
                </Form>
                {hasLoaded ? (
                    <>
                        {reviews.results.length ? (
                            <InfiniteScroll
                                children={
                                    reviews.results.map((review) => (
                                        <Review key={review.id} {...review} setReviews={setReviews} />
                                    ))
                                }
                                dataLength={reviews.results.length}
                                loader={<Asset spinner />}
                                hasMore={!!reviews.next}
                                next={() => fetchMoreData(reviews, setReviews)}
                            />

                        ) : (<Container className={appStyles.Content}>
                            <Asset src={NoResults} message={message} />
                        </Container>)}
                    </>
                ) : (
                    <Container className={appStyles.Content}>
                        <Asset spinner />
                    </Container>
                )}

            </Col>
            <Col md={3} className="d-none d-lg-block p-0 p-lg-2">
                <MostPopularReviews />
            </Col>
        </Row>
    );
}

export default ReviewsPage;