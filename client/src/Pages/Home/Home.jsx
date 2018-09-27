import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { Link } from 'react-router-dom';

class App extends Component {

	componentWillMount() {
		this.props.getGames.subscribeToMore({
			document: gameSub,
			variables: { hash: '1' },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				console.log('😅😅😅😅', prev, subscriptionData);

				const newGame = subscriptionData.data.gameSubscription;
				return {
					Games: [
						...prev.Games,
						newGame
					]
				}
			}
		})
	}

	componentWillReceiveProps(nextProps) {
		console.log('💣💣💣💣', nextProps);
	}

	render() {
		const { Games, loading } = this.props.getGames;

		if(loading) return <p>Loading, please wait</p>

		return (
			<div className="page page--home">
				<Link to="/create">Create a new one</Link>
				{Games && Games.length > 0 && (
					<div>
						<p>Here are the games folks:</p>
						{Games.map(game => (
							<div key={game.id}>
								<p>
									<strong>GameID</strong>: {game.id} <br/>
									<strong>GameHash</strong>: {game.hash} <br/>
									<strong>GameName</strong>: {game.name} <br/>
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
}

const getGames = gql`
	query getGames {
		Games {
			id
			name
			hash
		}
	}
`;

const createGame = gql`
	mutation createGame($name: String!) {
		createGame(name: $name) {
			id
			hash
			name
		}
	}
`;

const gameSub = gql`
	subscription gameSub($hash: String!) {
		gameSubscription(hash: $hash) {
			id
			name
			hash
		}
	}
`;

export default compose(
		graphql(getGames, { name: 'getGames' }),
		graphql(createGame, { name: 'createGame' })
	)(App);