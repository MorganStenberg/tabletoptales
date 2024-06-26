import React, { useState } from 'react'
import styles from "../../styles/Comment.module.css"
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { MoreDropdown } from '../../components/MoreDropDown';
import { axiosRes } from '../../api/axiosDefaults';
import CommentEditForm from './CommentEditForm';

// Credit to Code Institute Moments Walkthrough for structure of Comment component
const Comment = (props) => {

	const {
		profile_id,
		profile_image,
		owner,
		created_at,
		content,
		id,
		setReview,
		setComments,
	} = props;

	const currentUser = useCurrentUser();
	const is_owner = currentUser?.username === owner;
	const [showEditForm, setShowEditForm] = useState(false);

	const handleDelete = async () => {
		try {
			await axiosRes.delete(`/comments/${id}`)
			setReview(prevReview => ({
				results: [{
					...prevReview.results[0],
					comments_count: prevReview.results[0].comments_count - 1
				}]
			}))

			setComments(prevComments => ({
				...prevComments,
				results: prevComments.results.filter((comment) => comment.id !== id),
			}))
		} catch (err) {

		}
	}




	return (
		<>

			<Media>
				<Link to={`/profiles/${profile_id}`}>
					<Avatar src={profile_image} />
				</Link>
				<Media.Body className="align-self-center ml-2">
					<span className={styles.Owner}>{owner}</span>
					<span className={styles.Date}>{created_at}</span>
					{showEditForm ? (
						<CommentEditForm
							id={id}
							profile_id={profile_id}
							content={content}
							profileImage={profile_image}
							setComments={setComments}
							setShowEditForm={setShowEditForm}
						/>
					) : (
						<p>{content}</p>
					)}
				</Media.Body>
				{is_owner && !showEditForm && (
					<MoreDropdown
						handleEdit={() => setShowEditForm(true)}
						handleDelete={handleDelete}
					/>
				)}
			</Media>
		</>
	)
}

export default Comment