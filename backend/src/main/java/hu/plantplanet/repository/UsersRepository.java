package hu.plantplanet.repository;

import hu.plantplanet.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    Users findByEmail(String email);

    @Query(nativeQuery = true,
            value="SELECT p.id FROM permission p " +
                    "INNER JOIN allocate a ON p.id = a.permission_id " +
                    "WHERE a.user_id = :userid")
    List<String> findPermissionsByUser(@Param("userid") Integer userId);
}
