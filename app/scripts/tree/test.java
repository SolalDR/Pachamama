test_all(col, line) {
		
		var possibility = new Array(4); 

		// La ligne
		possibility[0] = test_direction(col, line, -1, 0) + test_direction(col, line, 1, 0) - 1;
		
		// La colonne
		possibility[1] = test_direction(col, line, 0, -1) + test_direction(col, line, 0, 1) - 1;
		
		// Diagonale ASC 
		possibility[2] = test_direction(col, line, -1, -1) + test_direction(col, line, 1, 1) - 1;
		
		// Diagonale DESC
		possibility[3] = test_direction(col, line, -1, 1) + test_direction(col, line, 1, -1) - 1;

		// Parcours les résultats, si l'un est valide on a gagné (return true) sinon (return false)
		for( var i=0; i<possibility.length; i++ ){
			if( possibility[i] >= 4) {
				return true; 
			}
		}
		return false;
	}

	outOfBorn ( col, line ){
		// Test  0 <= col <= 6 et 0 <= line <= 6
		if( col > maxCol - 1 || col < 0 || line > maxLine - 1 || line < 0 ) {
			return true; 
		}
		return false;
	}


	test_direction( col, line, delta_col, delta_line ){	
		var count = 0; 				// Nombre d'occurence trouver 
		var sign = game[col][line]	// Le signe qu'on cherche à compter
		var validSign = true; 		// à Vrai par défaut pour rentrer dans la boucle 

		// Tant que les coordonnées ne sont pas en dehors du tableau et que le sign est valide
		while ( !outOfBorn( col, line ) && validSign ){
			// Si le sign est toujours valide
			if( game[col][line] == sign ){
				count++;	// On incrémente
			} else {
				validSign = false; // Sinon le signe n'est plus valide (on ne rentre plus dans la boucle)
			}
			// Applique le delta pour changer de case à vérifier
			col += delta_col; 
			line += delta_line; 
		}

		// A la fin on retourne le compte
		return count; 
	}