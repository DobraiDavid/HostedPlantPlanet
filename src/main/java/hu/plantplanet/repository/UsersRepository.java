package hu.plantplanet.repository;

import hu.plantplanet.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface UsersRepository extends JpaRepository<Users, Integer> {

    Users findUserByName(String name);

    @Query(nativeQuery = true,
            value="SELECT p.id FROM permission p " +
                    "INNER JOIN allocate a ON p.id = a.permission_id " +
                    "WHERE a.user_id = :userid")
    List<String> findPermissionsByUser(@Param("userid") Integer userId);
}
